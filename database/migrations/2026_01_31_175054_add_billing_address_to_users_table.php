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
        Schema::table('users', function (Blueprint $table) {
            $table->string('street')->nullable()->after('email');
            $table->string('postal_code')->nullable()->after('street');
            $table->string('city')->nullable()->after('postal_code');
            $table->string('country', 2)->nullable()->after('city');
            $table->string('company')->nullable()->after('country');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['street', 'postal_code', 'city', 'country', 'company']);
        });
    }
};
