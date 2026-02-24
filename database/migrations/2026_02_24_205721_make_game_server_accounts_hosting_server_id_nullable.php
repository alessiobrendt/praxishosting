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
        Schema::table('game_server_accounts', function (Blueprint $table) {
            $table->dropForeign(['hosting_server_id']);
        });
        Schema::table('game_server_accounts', function (Blueprint $table) {
            $table->unsignedBigInteger('hosting_server_id')->nullable()->change();
            $table->foreign('hosting_server_id')->references('id')->on('hosting_servers')->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('game_server_accounts', function (Blueprint $table) {
            $table->dropForeign(['hosting_server_id']);
        });
        Schema::table('game_server_accounts', function (Blueprint $table) {
            $table->unsignedBigInteger('hosting_server_id')->nullable(false)->change();
            $table->foreign('hosting_server_id')->references('id')->on('hosting_servers')->cascadeOnDelete();
        });
    }
};
