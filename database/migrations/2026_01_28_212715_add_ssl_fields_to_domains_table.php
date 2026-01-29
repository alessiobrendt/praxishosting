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
        Schema::table('domains', function (Blueprint $table) {
            $table->string('ssl_status')->nullable()->after('is_verified'); // valid, expiring_soon, invalid, not_configured
            $table->timestamp('ssl_expires_at')->nullable()->after('ssl_status');
            $table->timestamp('ssl_checked_at')->nullable()->after('ssl_expires_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('domains', function (Blueprint $table) {
            $table->dropColumn(['ssl_status', 'ssl_expires_at', 'ssl_checked_at']);
        });
    }
};
