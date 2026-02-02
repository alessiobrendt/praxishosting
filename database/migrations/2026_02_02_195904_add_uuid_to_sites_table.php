<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('sites', function (Blueprint $table) {
            $table->uuid('uuid')->nullable()->after('id');
        });

        foreach (DB::table('sites')->get() as $site) {
            DB::table('sites')->where('id', $site->id)->update(['uuid' => (string) Str::uuid()]);
        }

        Schema::table('sites', function (Blueprint $table) {
            $table->unique('uuid');
        });

        if (Schema::getConnection()->getDriverName() === 'mysql') {
            DB::statement('ALTER TABLE sites MODIFY uuid CHAR(36) NOT NULL');
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('sites', function (Blueprint $table) {
            $table->dropUnique(['uuid']);
            $table->dropColumn('uuid');
        });
    }
};
