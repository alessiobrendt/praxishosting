<?php

namespace Database\Seeders;

use App\Models\EmailTemplate;
use Illuminate\Database\Seeder;

class TicketEmailTemplateSeeder extends Seeder
{
    public function run(): void
    {
        $templates = [
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
}
