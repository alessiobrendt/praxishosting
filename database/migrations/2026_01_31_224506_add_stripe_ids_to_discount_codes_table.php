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
        Schema::table('discount_codes', function (Blueprint $table) {
            $table->string('stripe_coupon_id')->nullable()->after('is_active');
            $table->string('stripe_promotion_code_id')->nullable()->after('stripe_coupon_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('discount_codes', function (Blueprint $table) {
            $table->dropColumn(['stripe_coupon_id', 'stripe_promotion_code_id']);
        });
    }
};
