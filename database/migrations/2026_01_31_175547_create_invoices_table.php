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
        Schema::create('invoices', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('site_subscription_id')->nullable()->constrained()->nullOnDelete();
            $table->string('stripe_invoice_id')->nullable()->unique();
            $table->string('number')->unique();
            $table->string('type')->default('subscription'); // subscription, one-time, etc.
            $table->decimal('amount', 10, 2);
            $table->decimal('tax', 10, 2)->default(0);
            $table->string('status')->default('draft'); // draft, paid, failed
            $table->date('billing_period_start')->nullable();
            $table->date('billing_period_end')->nullable();
            $table->date('invoice_date');
            $table->string('pdf_path')->nullable();
            $table->string('invoice_xml_path')->nullable();
            $table->json('metadata')->nullable();
            $table->timestamps();

            $table->index(['user_id', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('invoices');
    }
};
