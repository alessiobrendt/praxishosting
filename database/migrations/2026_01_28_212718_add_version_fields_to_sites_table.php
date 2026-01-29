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
            $table->foreignId('published_version_id')->nullable()->after('status')->constrained('site_versions')->nullOnDelete();
            $table->foreignId('draft_version_id')->nullable()->after('published_version_id')->constrained('site_versions')->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('sites', function (Blueprint $table) {
            $table->dropForeign(['published_version_id']);
            $table->dropForeign(['draft_version_id']);
            $table->dropColumn(['published_version_id', 'draft_version_id']);
        });
    }
};
