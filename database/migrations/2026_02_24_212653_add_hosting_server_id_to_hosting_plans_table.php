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
        Schema::table('hosting_plans', function (Blueprint $table) {
            $table->foreignId('hosting_server_id')->nullable()->after('brand_id')->constrained()->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('hosting_plans', function (Blueprint $table) {
            $table->dropForeign(['hosting_server_id']);
        });
    }
};
