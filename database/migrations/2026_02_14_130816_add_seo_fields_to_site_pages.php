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
        Schema::table('site_pages', function (Blueprint $table) {
            $table->string('meta_title', 70)->nullable()->after('name');
            $table->string('meta_description', 160)->nullable()->after('meta_title');
            $table->string('og_title', 70)->nullable()->after('meta_description');
            $table->string('og_description', 200)->nullable()->after('og_title');
            $table->string('og_image', 500)->nullable()->after('og_description');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('site_pages', function (Blueprint $table) {
            $table->dropColumn(['meta_title', 'meta_description', 'og_title', 'og_description', 'og_image']);
        });
    }
};
