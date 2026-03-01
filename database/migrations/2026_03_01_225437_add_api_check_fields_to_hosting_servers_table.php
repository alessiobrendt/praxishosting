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
        Schema::table('hosting_servers', function (Blueprint $table) {
            $table->timestamp('api_checked_at')->nullable()->after('is_active');
            $table->string('api_check_status', 10)->nullable()->after('api_checked_at');
            $table->text('api_check_message')->nullable()->after('api_check_status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('hosting_servers', function (Blueprint $table) {
            $table->dropColumn(['api_checked_at', 'api_check_status', 'api_check_message']);
        });
    }
};
