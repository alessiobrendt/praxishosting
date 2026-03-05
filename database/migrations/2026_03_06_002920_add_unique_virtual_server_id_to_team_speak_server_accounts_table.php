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
        Schema::table('team_speak_server_accounts', function (Blueprint $table) {
            $table->unique(['hosting_server_id', 'virtual_server_id'], 'ts_accounts_host_virtual_server_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('team_speak_server_accounts', function (Blueprint $table) {
            $table->dropUnique('ts_accounts_host_virtual_server_unique');
        });
    }
};
