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
        Schema::create('invoice_dunning_letters', function (Blueprint $table) {
            $table->id();
            $table->foreignId('invoice_id')->constrained()->cascadeOnDelete();
            $table->unsignedTinyInteger('level');
            $table->timestamp('sent_at')->nullable();
            $table->decimal('fee_amount', 10, 2)->default(0);
            $table->string('pdf_path')->nullable();
            $table->timestamps();

            $table->index(['invoice_id', 'level']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('invoice_dunning_letters');
    }
};
