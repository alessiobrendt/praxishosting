<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\SendTestEmailTemplateRequest;
use App\Http\Requests\Admin\UpdateEmailTemplateRequest;
use App\Mail\TransactionalTemplateMail;
use App\Models\AdminActivityLog;
use App\Models\EmailTemplate;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;
use Inertia\Response;

class EmailController extends Controller
{
    public function index(Request $request): Response
    {
        $templates = EmailTemplate::query()->orderBy('key')->get();

        return Inertia::render('admin/emails/Index', [
            'templates' => $templates,
        ]);
    }

    public function edit(EmailTemplate $emailTemplate): Response
    {
        $placeholders = $this->placeholdersFor($emailTemplate->key);

        return Inertia::render('admin/emails/Edit', [
            'emailTemplate' => $emailTemplate,
            'placeholders' => $placeholders,
        ]);
    }

    public function update(UpdateEmailTemplateRequest $request, EmailTemplate $emailTemplate): RedirectResponse
    {
        $old = $emailTemplate->only(['subject', 'greeting', 'body', 'action_text', 'action_url']);
        $emailTemplate->update($request->validated());

        AdminActivityLog::log($request->user()->id, 'email_template_updated', EmailTemplate::class, 0, array_merge($old, ['key' => $emailTemplate->key]), array_merge($request->validated(), ['key' => $emailTemplate->key]));

        return redirect()->route('admin.emails.index')->with('success', 'E-Mail-Vorlage aktualisiert.');
    }

    /**
     * Preview template with sample data. Accepts optional subject, greeting, body, action_text to preview unsaved form.
     * Returns replaced text plus full rendered HTML (Maizzle layout) for iframe preview.
     */
    public function preview(Request $request, EmailTemplate $emailTemplate): JsonResponse
    {
        $subject = $request->input('subject', $emailTemplate->subject);
        $greeting = $request->input('greeting', $emailTemplate->greeting);
        $body = $request->input('body', $emailTemplate->body);
        $actionText = $request->input('action_text', $emailTemplate->action_text);

        $replacements = $this->sampleReplacements($emailTemplate->key);
        $search = array_map(fn (string $key) => ':'.$key, array_keys($replacements));
        $values = array_map(fn ($value) => (string) $value, array_values($replacements));

        $content = [
            'subject' => str_replace($search, $values, $subject),
            'greeting' => str_replace($search, $values, $greeting),
            'body' => str_replace($search, $values, $body),
            'action_text' => $actionText ? str_replace($search, $values, $actionText) : null,
        ];
        $actionUrl = $this->sampleActionUrl($emailTemplate->key);
        $html = TransactionalTemplateMail::renderHtml($content, $actionUrl);

        return response()->json([
            'subject' => $content['subject'],
            'greeting' => $content['greeting'],
            'body' => $content['body'],
            'action_text' => $content['action_text'],
            'html' => $html,
        ]);
    }

    /**
     * Send a test email using the saved template and sample data.
     */
    public function sendTest(SendTestEmailTemplateRequest $request, EmailTemplate $emailTemplate): RedirectResponse
    {
        $to = $request->validated('email') ?? $request->user()->email;
        $content = $emailTemplate->replace($this->sampleReplacements($emailTemplate->key));
        $actionUrl = $this->sampleActionUrl($emailTemplate->key);

        Mail::to($to)->send(new TransactionalTemplateMail($content, $actionUrl, isTest: true));

        return back()->with('success', 'Test-E-Mail wurde an '.$to.' gesendet.');
    }

    /**
     * @return array<int, string>
     */
    private function placeholdersFor(string $key): array
    {
        return match ($key) {
            'order_completed' => ['user_name', 'site_name', 'site_url'],
            'order_completed_webspace' => ['user_name', 'domain', 'plesk_username', 'plesk_password', 'login_url'],
            'invoice_created' => ['user_name', 'invoice_number', 'amount', 'invoice_date', 'pdf_url'],
            'payment_received' => ['user_name', 'amount', 'invoice_number', 'payment_date'],
            'payment_failed' => ['user_name', 'invoice_number', 'amount', 'billing_portal_url'],
            'subscription_ending_soon' => ['user_name', 'site_name', 'ends_at', 'days_remaining', 'billing_portal_url'],
            'site_suspended' => ['user_name', 'site_name', 'billing_portal_url'],
            'site_deleted' => ['user_name', 'site_name', 'create_site_url'],
            'webspace_deactivated' => ['user_name', 'domain', 'billing_portal_url'],
            'login' => ['user_name', 'login_at'],
            'ticket_created' => ['user_name', 'ticket_subject', 'ticket_url'],
            'ticket_reply' => ['user_name', 'ticket_subject', 'ticket_url'],
            'ticket_admin_reply' => ['user_name', 'ticket_subject', 'ticket_url'],
            default => [],
        };
    }

    /**
     * @return array<string, string>
     */
    private function sampleReplacements(string $key): array
    {
        $base = [
            'user_name' => 'Max Mustermann',
            'site_name' => 'Meine Beispiel-Webseite',
            'site_url' => config('app.url').'/sites/1',
            'invoice_number' => 'R-2026-001',
            'amount' => '9,99 €',
            'invoice_date' => now()->format('d.m.Y'),
            'pdf_url' => config('app.url').'/invoices/1/pdf',
            'payment_date' => now()->format('d.m.Y'),
            'billing_portal_url' => config('app.url').'/billing/portal',
            'create_site_url' => config('app.url').'/sites/create',
            'ends_at' => now()->addDays(7)->format('d.m.Y'),
            'days_remaining' => '7',
            'domain' => 'beispiel.de',
            'plesk_username' => 'ws0001abc',
            'plesk_password' => '••••••••',
            'login_url' => config('app.url').'/webspace-accounts/1/plesk-login',
            'login_at' => now()->format('d.m.Y H:i'),
            'ticket_subject' => 'Frage zu meiner Bestellung',
            'ticket_url' => config('app.url').'/support/1',
        ];

        return array_intersect_key($base, array_flip($this->placeholdersFor($key)));
    }

    private function sampleActionUrl(string $key): ?string
    {
        return match ($key) {
            'order_completed' => config('app.url').'/sites/1',
            'order_completed_webspace' => config('app.url').'/webspace-accounts/1/plesk-login',
            'invoice_created' => config('app.url').'/invoices/1/pdf',
            'payment_received' => config('app.url').'/invoices/1/pdf',
            'payment_failed', 'subscription_ending_soon', 'site_suspended', 'webspace_deactivated' => config('app.url').'/billing/portal',
            'site_deleted' => config('app.url').'/sites/create',
            'login' => config('app.url').'/dashboard',
            'ticket_created', 'ticket_reply' => config('app.url').'/support/1',
            'ticket_admin_reply' => config('app.url').'/admin/tickets/1',
            default => null,
        };
    }
}
