<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('hosting_servers', function (Blueprint $table) {
            $table->foreignId('brand_id')->nullable()->after('id')->constrained()->nullOnDelete();
            $table->string('panel_type')->default('plesk')->after('brand_id');
            $table->json('config')->nullable()->after('panel_type');
        });

        $defaultBrandId = DB::table('brands')->value('id');
        if ($defaultBrandId !== null) {
            DB::table('hosting_servers')->whereNull('brand_id')->update(['brand_id' => $defaultBrandId]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('hosting_servers', function (Blueprint $table) {
            $table->dropForeign(['brand_id']);
            $table->dropColumn(['brand_id', 'panel_type', 'config']);
        });
    }
};
