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
        Schema::create('team_speak_server_accounts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('hosting_plan_id')->constrained()->cascadeOnDelete();
            $table->foreignId('hosting_server_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('product_id')->nullable()->constrained()->nullOnDelete();
            $table->string('name');
            $table->unsignedBigInteger('virtual_server_id')->nullable();
            $table->unsignedInteger('port')->nullable();
            $table->text('credentials_encrypted')->nullable();
            $table->string('status')->default('active');
            $table->string('mollie_subscription_id')->nullable();
            $table->string('mollie_payment_id')->nullable();
            $table->timestamp('current_period_ends_at')->nullable();
            $table->boolean('cancel_at_period_end')->default(false);
            $table->timestamp('ends_at')->nullable();
            $table->string('renewal_type')->nullable();
            $table->json('option_values')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('team_speak_server_accounts');
    }
};
