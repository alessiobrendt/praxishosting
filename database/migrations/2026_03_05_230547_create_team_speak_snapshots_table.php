<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('team_speak_snapshots', function (Blueprint $table) {
            $table->id();
            $table->foreignId('team_speak_server_account_id')->constrained('team_speak_server_accounts')->cascadeOnDelete();
            $table->longText('snapshot');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('team_speak_snapshots');
    }
};
