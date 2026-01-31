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
            $table->string('pin_hash')->nullable()->after('remember_token');
            $table->unsignedTinyInteger('pin_length')->nullable()->after('pin_hash');
            $table->unsignedTinyInteger('inactivity_lock_minutes')->default(0)->after('pin_length');
            $table->integer('pin_failed_attempts')->default(0)->after('inactivity_lock_minutes');
            $table->timestamp('pin_lockout_until')->nullable()->after('pin_failed_attempts');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'pin_hash',
                'pin_length',
                'inactivity_lock_minutes',
                'pin_failed_attempts',
                'pin_lockout_until',
            ]);
        });
    }
};
