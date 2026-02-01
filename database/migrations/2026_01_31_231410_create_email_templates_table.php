<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('email_templates', function (Blueprint $table) {
            $table->string('key')->primary();
            $table->string('name');
            $table->string('subject');
            $table->string('greeting');
            $table->text('body');
            $table->string('action_text')->nullable();
            $table->timestamps();
        });

        $now = now();
        $templates = [
            [
                'key' => 'order_completed',
                'name' => 'Bestellung abgeschlossen',
                'subject' => 'Ihre Bestellung wurde abgeschlossen',
                'greeting' => 'Hallo :user_name,',
                'body' => "Ihre Bestellung wurde erfolgreich abgeschlossen.\nIhre Webseite **:site_name** wurde eingerichtet.\nVielen Dank für Ihr Vertrauen.",
                'action_text' => 'Zur Webseite',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'key' => 'invoice_created',
                'name' => 'Rechnung erstellt',
                'subject' => 'Ihre Rechnung :invoice_number',
                'greeting' => 'Hallo :user_name,',
                'body' => "Ihre Rechnung **:invoice_number** wurde erstellt.\nBetrag: **:amount**\nDatum: :invoice_date\nVielen Dank für Ihr Vertrauen.",
                'action_text' => 'Rechnung als PDF herunterladen',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'key' => 'payment_failed',
                'name' => 'Zahlung fehlgeschlagen',
                'subject' => 'Zahlung fehlgeschlagen – bitte Zahlungsart prüfen',
                'greeting' => 'Hallo :user_name,',
                'body' => "Eine Zahlung konnte nicht durchgeführt werden.\nRechnung: :invoice_number\nBetrag: :amount\nBitte aktualisieren Sie Ihre Zahlungsmethode, um Unterbrechungen zu vermeiden.",
                'action_text' => 'Zahlungsart verwalten',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'key' => 'subscription_ending_soon',
                'name' => 'Abo läuft bald ab',
                'subject' => 'Ihr Abo für „:site_name" läuft bald ab',
                'greeting' => 'Hallo :user_name,',
                'body' => "Ihr Abonnement für die Webseite **:site_name** läuft am **:ends_at** aus.\nBitte stellen Sie sicher, dass Ihre Zahlungsmethode gültig ist, um eine Verlängerung zu ermöglichen.\nBei Fragen stehen wir Ihnen gerne zur Verfügung.",
                'action_text' => 'Zahlungsart verwalten',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'key' => 'site_suspended',
                'name' => 'Webseite gesperrt',
                'subject' => 'Ihre Webseite „:site_name" wurde gesperrt',
                'greeting' => 'Hallo :user_name,',
                'body' => "Ihr Abonnement für die Webseite **:site_name** ist abgelaufen.\nDie Webseite wurde vorübergehend gesperrt. Innerhalb der Kulanzfrist können Sie durch Aktualisierung Ihrer Zahlungsmethode und erfolgreiche Verlängerung die Sperrung aufheben.\nBitte handeln Sie zeitnah, um den Zugriff wiederherzustellen.",
                'action_text' => 'Zahlungsart verwalten',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'key' => 'site_deleted',
                'name' => 'Löschung nach Kulanzfrist',
                'subject' => 'Ihre Webseite „:site_name" wurde gelöscht',
                'greeting' => 'Hallo :user_name,',
                'body' => "Die Webseite **:site_name** wurde nach Ablauf der Kulanzfrist endgültig gelöscht.\nSie können jederzeit eine neue Webseite anlegen.\nBei Fragen stehen wir Ihnen gerne zur Verfügung.",
                'action_text' => 'Neue Webseite erstellen',
                'created_at' => $now,
                'updated_at' => $now,
            ],
        ];

        foreach ($templates as $template) {
            DB::table('email_templates')->insert($template);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('email_templates');
    }
};
