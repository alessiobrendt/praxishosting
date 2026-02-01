<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AdminActivityLog;
use App\Models\DiscountCode;
use App\Models\EmailTemplate;
use App\Models\Invoice;
use App\Models\OrderConfirmation;
use App\Models\Quote;
use App\Models\Reminder;
use App\Models\Site;
use App\Models\Template;
use App\Models\TemplatePage;
use App\Models\Ticket;
use App\Models\TicketCategory;
use App\Models\TicketPriority;
use App\Models\TicketTodo;
use App\Models\User;
use App\Models\Voucher;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ActivityLogController extends Controller
{
    /**
     * Admin activity log with optional filters: action, model_type, from, to.
     */
    public function index(Request $request): Response
    {
        $query = AdminActivityLog::query()
            ->with('user:id,name')
            ->latest();

        if ($request->filled('action')) {
            $query->where('action', $request->action);
        }
        if ($request->filled('model_type')) {
            $query->where('model_type', $request->model_type);
        }
        if ($request->filled('from')) {
            $query->whereDate('created_at', '>=', Carbon::parse($request->from)->startOfDay());
        }
        if ($request->filled('to')) {
            $query->whereDate('created_at', '<=', Carbon::parse($request->to)->endOfDay());
        }

        $activityLog = $query->paginate(20)->withQueryString()->through(fn (AdminActivityLog $log) => array_merge($log->toArray(), [
            'created_at' => $log->created_at->format('d.m.Y H:i'),
        ]));

        $actionOptions = [
            'site_status_updated' => 'Site-Status geändert',
            'site_subscription_period_updated' => 'Laufzeitende geändert',
            'site_subscription_cancelled' => 'Abo gekündigt',
            'site_subscription_reactivated' => 'Kündigung zurückgenommen',
            'site_subscription_synced' => 'Abo mit Stripe abgeglichen',
            'customer_updated' => 'Kunden-Stammdaten geändert',
            'customer_note_added' => 'Kunden-Notiz hinzugefügt',
            'customer_balance_added' => 'Guthaben aufgeladen',
            'ticket_updated' => 'Ticket aktualisiert',
            'ticket_message_stored' => 'Ticket-Nachricht gespeichert',
            'ticket_time_log_added' => 'Ticket-Zeiteintrag hinzugefügt',
            'ticket_todo_added' => 'Ticket-To-do hinzugefügt',
            'ticket_todo_updated' => 'Ticket-To-do aktualisiert',
            'ticket_todo_deleted' => 'Ticket-To-do gelöscht',
            'ticket_merged' => 'Ticket zusammengeführt',
            'ticket_category_created' => 'Ticket-Kategorie erstellt',
            'ticket_category_updated' => 'Ticket-Kategorie aktualisiert',
            'ticket_category_deleted' => 'Ticket-Kategorie gelöscht',
            'ticket_priority_created' => 'Ticket-Priorität erstellt',
            'ticket_priority_updated' => 'Ticket-Priorität aktualisiert',
            'ticket_priority_deleted' => 'Ticket-Priorität gelöscht',
            'invoice_created' => 'Rechnung erstellt',
            'invoice_updated' => 'Rechnung aktualisiert',
            'invoice_dunning_letter_added' => 'Mahnung hinzugefügt',
            'quote_created' => 'Angebot erstellt',
            'order_confirmation_created' => 'Auftragsbestätigung erstellt',
            'communication_created' => 'Erinnerung erfasst',
            'email_template_updated' => 'E-Mail-Vorlage aktualisiert',
            'system_settings_updated' => 'Systemeinstellungen geändert',
            'discount_code_created' => 'Rabattcode erstellt',
            'discount_code_updated' => 'Rabattcode aktualisiert',
            'discount_code_deleted' => 'Rabattcode gelöscht',
            'voucher_created' => 'Gutschein erstellt',
            'voucher_updated' => 'Gutschein aktualisiert',
            'template_created' => 'Template erstellt',
            'template_updated' => 'Template aktualisiert',
            'template_deleted' => 'Template gelöscht',
            'template_design_updated' => 'Template-Design aktualisiert',
            'template_page_created' => 'Template-Seite erstellt',
            'template_page_updated' => 'Template-Seite aktualisiert',
            'template_page_deleted' => 'Template-Seite gelöscht',
            'template_page_data_updated' => 'Template-Seitendaten aktualisiert',
        ];

        $modelTypeOptions = [
            Site::class => 'Site',
            User::class => 'Kunde',
            Ticket::class => 'Ticket',
            TicketCategory::class => 'Ticket-Kategorie',
            TicketPriority::class => 'Ticket-Priorität',
            TicketTodo::class => 'Ticket-To-do',
            Invoice::class => 'Rechnung',
            Quote::class => 'Angebot',
            OrderConfirmation::class => 'Auftragsbestätigung',
            Reminder::class => 'Erinnerung',
            EmailTemplate::class => 'E-Mail-Vorlage',
            DiscountCode::class => 'Rabattcode',
            Voucher::class => 'Gutschein',
            Template::class => 'Template',
            TemplatePage::class => 'Template-Seite',
            'system' => 'System',
        ];

        return Inertia::render('admin/activity-log/Index', [
            'activityLog' => $activityLog,
            'filters' => $request->only(['action', 'model_type', 'from', 'to']),
            'actionOptions' => $actionOptions,
            'modelTypeOptions' => $modelTypeOptions,
        ]);
    }
}
