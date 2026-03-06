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
            $table->decimal('custom_monthly_price', 10, 2)->nullable()->after('option_values');
        });
        Schema::table('game_server_accounts', function (Blueprint $table) {
            $table->decimal('custom_monthly_price', 10, 2)->nullable()->after('option_values');
        });
        Schema::table('webspace_accounts', function (Blueprint $table) {
            $table->decimal('custom_monthly_price', 10, 2)->nullable()->after('auto_renew_with_balance');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('team_speak_server_accounts', function (Blueprint $table) {
            $table->dropColumn('custom_monthly_price');
        });
        Schema::table('game_server_accounts', function (Blueprint $table) {
            $table->dropColumn('custom_monthly_price');
        });
        Schema::table('webspace_accounts', function (Blueprint $table) {
            $table->dropColumn('custom_monthly_price');
        });
    }
};
