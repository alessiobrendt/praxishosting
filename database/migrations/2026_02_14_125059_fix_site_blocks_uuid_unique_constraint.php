<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Change uuid from global unique to unique per site_page (allows same block id on different pages).
     */
    public function up(): void
    {
        Schema::table('site_blocks', function (Blueprint $table) {
            $table->dropUnique(['uuid']);
            $table->unique(['site_page_id', 'uuid']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('site_blocks', function (Blueprint $table) {
            $table->dropUnique(['site_page_id', 'uuid']);
            $table->unique('uuid');
        });
    }
};
