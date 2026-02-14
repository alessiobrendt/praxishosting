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
            $table->string('favicon_url', 500)->nullable()->after('custom_colors');
        });

        Schema::table('site_pages', function (Blueprint $table) {
            $table->string('robots', 100)->nullable()->after('og_image');
            $table->string('twitter_card', 50)->nullable()->after('robots');
            $table->string('twitter_title', 70)->nullable()->after('twitter_card');
            $table->string('twitter_description', 200)->nullable()->after('twitter_title');
            $table->string('twitter_image', 500)->nullable()->after('twitter_description');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('sites', function (Blueprint $table) {
            $table->dropColumn('favicon_url');
        });

        Schema::table('site_pages', function (Blueprint $table) {
            $table->dropColumn(['robots', 'twitter_card', 'twitter_title', 'twitter_description', 'twitter_image']);
        });
    }
};
