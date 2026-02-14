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
        Schema::table('sites', function (Blueprint $table) {
            $table->boolean('use_normalized_pages')->default(false)->after('has_page_designer');
        });

        Schema::table('site_blocks', function (Blueprint $table) {
            $table->string('uuid', 64)->nullable()->unique()->after('id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('sites', function (Blueprint $table) {
            $table->dropColumn('use_normalized_pages');
        });

        Schema::table('site_blocks', function (Blueprint $table) {
            $table->dropColumn('uuid');
        });
    }
};
