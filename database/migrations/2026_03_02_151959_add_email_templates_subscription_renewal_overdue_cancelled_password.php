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
                'key' => 'subscription_renewal_invoice_created',
                'name' => 'Rechnung für Abo-Verlängerung erstellt',
                'subject' => 'Ihre Rechnung für die Verlängerung von „:site_name"',
                'greeting' => 'Hallo :user_name,',
                'body' => "Ihre Rechnung **:invoice_number** für die Abo-Verlängerung wurde erstellt.\nBetrag: **:amount**\nFällig am: :due_date\nRechnungsdatum: :invoice_date\nBitte zahlen Sie rechtzeitig, um die Unterbrechung Ihres Abos zu vermeiden.",
                'action_text' => 'Rechnung anzeigen',
            ],
            [
                'key' => 'invoice_overdue',
                'name' => 'Rechnung überfällig',
                'subject' => 'Zahlungserinnerung: Rechnung :invoice_number',
                'greeting' => 'Hallo :user_name,',
                'body' => "Ihre Rechnung **:invoice_number** (Betrag: **:amount**) war am **:due_date** fällig und ist noch offen.\nBitte begleichen Sie den Betrag zeitnah, um Mahngebühren und eine Sperrung zu vermeiden.",
                'action_text' => 'Rechnung bezahlen',
            ],
            [
                'key' => 'subscription_cancelled',
                'name' => 'Abo gekündigt / läuft aus',
                'subject' => 'Ihr Abo für „:site_name" läuft aus',
                'greeting' => 'Hallo :user_name,',
                'body' => "Ihr Abonnement für die Webseite **:site_name** wurde gekündigt bzw. läuft am **:ends_at** aus.\nDanach wird die Webseite nicht mehr erreichbar sein. Bei Fragen stehen wir Ihnen gerne zur Verfügung.",
                'action_text' => 'Zum Abo-Bereich',
            ],
            [
                'key' => 'password_changed',
                'name' => 'Passwort geändert',
                'subject' => 'Ihr Passwort wurde geändert',
                'greeting' => 'Hallo :user_name,',
                'body' => "Ihr Passwort wurde am **:changed_at** geändert.\nFalls Sie das nicht waren, wenden Sie sich bitte umgehend an uns.",
                'action_text' => null,
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
            'subscription_renewal_invoice_created',
            'invoice_overdue',
            'subscription_cancelled',
            'password_changed',
        ])->delete();
    }
};
