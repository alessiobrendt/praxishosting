<?php

namespace Database\Seeders;

use App\Models\TicketMessageTemplate;
use Illuminate\Database\Seeder;

class TicketMessageTemplateSeeder extends Seeder
{
    public function run(): void
    {
        $templates = [
            [
                'name' => 'Begrüßung',
                'body' => '<p>Hallo {{name}},</p><p>vielen Dank für Ihre Anfrage zu Ticket #{{ticket_id}} ({{betreff}}).</p><p>Wir bearbeiten Ihr Anliegen zeitnah.</p><p>Mit freundlichen Grüßen<br>Ihr Support-Team</p>',
                'sort_order' => 0,
            ],
            [
                'name' => 'Warte auf Rückmeldung',
                'body' => '<p>Hallo {{name}},</p><p>wir warten noch auf Ihre Rückmeldung zu obiger Anfrage. Bitte antworten Sie, sobald Sie die gewünschten Informationen haben.</p><p>Mit freundlichen Grüßen</p>',
                'sort_order' => 1,
            ],
            [
                'name' => 'Ticket abgeschlossen',
                'body' => '<p>Hallo {{name}},</p><p>wir haben Ihr Anliegen (Ticket #{{ticket_id}}) bearbeitet und den Vorgang abgeschlossen.</p><p>Falls Sie weitere Fragen haben, können Sie jederzeit ein neues Ticket erstellen.</p><p>Mit freundlichen Grüßen</p>',
                'sort_order' => 2,
            ],
            [
                'name' => 'Zugewiesen – Info',
                'body' => '<p>Hallo {{name}},</p><p>Ihr Ticket wurde an {{zugewiesen}} zur Bearbeitung zugewiesen. Sie erhalten eine Nachricht, sobald es Neuigkeiten gibt.</p><p>Mit freundlichen Grüßen</p>',
                'sort_order' => 3,
            ],
            [
                'name' => 'Betroffener Dienst',
                'body' => '<p>Hallo {{name}},</p><p>bezugnehmend auf Ihr Ticket zu „{{produkt}}“: Bitte nennen Sie uns weitere Details (z. B. Fehlermeldung, Schritte zur Reproduktion), damit wir Sie gezielt unterstützen können.</p><p>Mit freundlichen Grüßen</p>',
                'sort_order' => 4,
            ],
        ];

        foreach ($templates as $data) {
            TicketMessageTemplate::updateOrCreate(
                ['name' => $data['name']],
                $data
            );
        }
    }
}
