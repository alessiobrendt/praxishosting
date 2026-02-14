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
        Schema::create('site_pages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('site_id')->constrained()->cascadeOnDelete();
            $table->string('slug', 255);
            $table->string('name')->nullable();
            $table->unsignedInteger('order')->default(0);
            $table->boolean('is_custom')->default(false);
            $table->boolean('is_active')->default(true);
            $table->foreignId('template_page_id')->nullable()->constrained('template_pages')->nullOnDelete();
            $table->timestamps();

            $table->unique(['site_id', 'slug']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('site_pages');
    }
};
