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
            $table->text('bind_zone_content')->nullable()->after('api_check_message');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('hosting_servers', function (Blueprint $table) {
            $table->dropColumn('bind_zone_content');
        });
    }
};
