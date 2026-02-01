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
        Schema::create('site_subscriptions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('site_id')->constrained()->cascadeOnDelete();
            $table->string('stripe_subscription_id')->unique()->nullable();
            $table->string('stripe_price_id')->nullable();
            $table->string('stripe_status')->nullable();
            $table->timestamp('current_period_ends_at')->nullable();
            $table->boolean('cancel_at_period_end')->default(false);
            $table->timestamp('ends_at')->nullable();
            $table->string('renewal_type')->default('auto'); // auto, manual
            $table->timestamps();

            $table->index(['site_id', 'stripe_status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('site_subscriptions');
    }
};
