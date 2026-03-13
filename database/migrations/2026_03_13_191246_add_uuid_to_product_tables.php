<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

return new class extends Migration
{
    private const TABLES = [
        'reseller_domains',
        'webspace_accounts',
        'game_server_accounts',
        'team_speak_server_accounts',
        'gameserver_cloud_subscriptions',
        'invoices',
        'user_email_logs',
    ];

    /**
     * Run the migrations.
     */
    public function up(): void
    {
        foreach (self::TABLES as $tableName) {
            Schema::table($tableName, function (Blueprint $table) {
                $table->uuid('uuid')->nullable()->after('id');
            });
        }

        foreach (self::TABLES as $tableName) {
            foreach (DB::table($tableName)->get() as $row) {
                DB::table($tableName)->where('id', $row->id)->update(['uuid' => (string) Str::uuid()]);
            }
        }

        foreach (self::TABLES as $tableName) {
            Schema::table($tableName, function (Blueprint $table) {
                $table->unique('uuid');
            });
        }

        if (Schema::getConnection()->getDriverName() === 'mysql') {
            foreach (self::TABLES as $tableName) {
                DB::statement("ALTER TABLE {$tableName} MODIFY uuid CHAR(36) NOT NULL");
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        foreach (self::TABLES as $tableName) {
            Schema::table($tableName, function (Blueprint $table) {
                $table->dropUnique(['uuid']);
                $table->dropColumn('uuid');
            });
        }
    }
};
