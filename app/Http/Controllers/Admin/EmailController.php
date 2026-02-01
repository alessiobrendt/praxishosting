<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\SendTestEmailTemplateRequest;
use App\Http\Requests\Admin\UpdateEmailTemplateRequest;
use App\Mail\EmailTemplateTestMail;
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
        $emailTemplate->update($request->validated());

        return redirect()->route('admin.emails.index')->with('success', 'E-Mail-Vorlage aktualisiert.');
    }

    /**
     * Preview template with sample data. Accepts optional subject, greeting, body, action_text to preview unsaved form.
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

        return response()->json([
            'subject' => str_replace($search, $values, $subject),
            'greeting' => str_replace($search, $values, $greeting),
            'body' => str_replace($search, $values, $body),
            'action_text' => $actionText ? str_replace($search, $values, $actionText) : null,
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

        Mail::to($to)->send(new EmailTemplateTestMail($content, $actionUrl));

        return back()->with('success', 'Test-E-Mail wurde an '.$to.' gesendet.');
    }

    /**
     * @return array<int, string>
     */
    private function placeholdersFor(string $key): array
    {
        return match ($key) {
            'order_completed' => ['user_name', 'site_name', 'site_url'],
            'invoice_created' => ['user_name', 'invoice_number', 'amount', 'invoice_date', 'pdf_url'],
            'payment_failed' => ['user_name', 'invoice_number', 'amount', 'billing_portal_url'],
            'subscription_ending_soon' => ['user_name', 'site_name', 'ends_at', 'billing_portal_url'],
            'site_suspended' => ['user_name', 'site_name', 'billing_portal_url'],
            'site_deleted' => ['user_name', 'site_name', 'create_site_url'],
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
            'billing_portal_url' => config('app.url').'/billing/portal',
            'create_site_url' => config('app.url').'/sites/create',
            'ends_at' => now()->addDays(7)->format('d.m.Y'),
        ];

        return array_intersect_key($base, array_flip($this->placeholdersFor($key)));
    }

    private function sampleActionUrl(string $key): ?string
    {
        return match ($key) {
            'order_completed' => config('app.url').'/sites/1',
            'invoice_created' => config('app.url').'/invoices/1/pdf',
            'payment_failed', 'subscription_ending_soon', 'site_suspended' => config('app.url').'/billing/portal',
            'site_deleted' => config('app.url').'/sites/create',
            default => null,
        };
    }
}
