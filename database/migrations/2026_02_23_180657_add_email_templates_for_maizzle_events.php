<?php

use App\Models\EmailTemplate;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $templates = [
            [
                'key' => 'login',
                'name' => 'Login-Benachrichtigung',
                'subject' => 'Sie haben sich eingeloggt',
                'greeting' => 'Hallo :user_name,',
                'body' => "Sie haben sich am :login_at in Ihr Konto eingeloggt.\nFalls Sie das nicht waren, ändern Sie bitte umgehend Ihr Passwort.",
                'action_text' => 'Zum Dashboard',
            ],
            [
                'key' => 'payment_received',
                'name' => 'Zahlung eingegangen',
                'subject' => 'Ihre Zahlung wurde verbucht',
                'greeting' => 'Hallo :user_name,',
                'body' => "Ihre Zahlung in Höhe von **:amount** wurde am :payment_date verbucht.\nRechnung: :invoice_number",
                'action_text' => 'Rechnung ansehen',
            ],
            [
                'key' => 'order_completed_webspace',
                'name' => 'Webspace-Bestellung abgeschlossen',
                'subject' => 'Ihr Webspace für :domain wurde eingerichtet',
                'greeting' => 'Hallo :user_name,',
                'body' => "Ihr Webspace wurde erfolgreich eingerichtet.\n**Domain:** :domain\n**Plesk-Benutzer:** :plesk_username\n**Passwort:** :plesk_password\nBitte bewahren Sie diese Zugangsdaten sicher auf.",
                'action_text' => 'Zum Plesk-Login',
            ],
            [
                'key' => 'webspace_deactivated',
                'name' => 'Webspace/Server deaktiviert',
                'subject' => 'Ihr Webspace :domain wurde deaktiviert',
                'greeting' => 'Hallo :user_name,',
                'body' => "Ihr Webspace **:domain** wurde aufgrund eines abgelaufenen Abonnements deaktiviert.\nUm den Zugriff wiederherzustellen, aktualisieren Sie bitte Ihre Zahlungsmethode und verlängern Sie das Abo.",
                'action_text' => 'Zahlungsart verwalten',
            ],
            [
                'key' => 'ticket_created',
                'name' => 'Support-Ticket erstellt',
                'subject' => 'Ihr Support-Ticket: :ticket_subject',
                'greeting' => 'Hallo :user_name,',
                'body' => "Ihr Support-Ticket wurde erstellt.\nBetreff: **:ticket_subject**\nSie erhalten eine Benachrichtigung, sobald wir geantwortet haben.",
                'action_text' => 'Ticket ansehen',
            ],
            [
                'key' => 'ticket_reply',
                'name' => 'Antwort auf Support-Ticket',
                'subject' => 'Neue Antwort auf Ihr Ticket: :ticket_subject',
                'greeting' => 'Hallo :user_name,',
                'body' => "Es gibt eine neue Antwort auf Ihr Support-Ticket **:ticket_subject**.\nBitte melden Sie sich an, um die Nachricht zu lesen und ggf. zu antworten.",
                'action_text' => 'Ticket ansehen',
            ],
            [
                'key' => 'ticket_admin_reply',
                'name' => 'Neue Kunden-Nachricht im Ticket',
                'subject' => 'Neue Nachricht im Ticket: :ticket_subject',
                'greeting' => 'Hallo,',
                'body' => "Der Kunde :user_name hat eine neue Nachricht im Ticket **:ticket_subject** geschrieben.\nBitte prüfen Sie das Ticket im Admin-Bereich.",
                'action_text' => 'Ticket im Admin öffnen',
            ],
        ];

        foreach ($templates as $data) {
            EmailTemplate::updateOrCreate(
                ['key' => $data['key']],
                $data
            );
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        EmailTemplate::whereIn('key', [
            'login',
            'payment_received',
            'order_completed_webspace',
            'webspace_deactivated',
            'ticket_created',
            'ticket_reply',
            'ticket_admin_reply',
        ])->delete();
    }
};
