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
        Schema::create('site_blocks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('site_id')->constrained()->cascadeOnDelete();
            $table->foreignId('site_page_id')->constrained()->cascadeOnDelete();
            $table->foreignId('parent_id')->nullable()->constrained('site_blocks')->cascadeOnDelete();
            $table->string('type', 255);
            $table->json('data')->nullable();
            $table->unsignedInteger('position')->default(0);
            $table->timestamps();

            $table->index(['site_page_id', 'parent_id', 'position']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('site_blocks');
    }
};
