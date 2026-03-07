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
        Schema::create('pterodactyl_egg_configs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('hosting_server_id')->constrained('hosting_servers')->cascadeOnDelete();
            $table->unsignedInteger('nest_id');
            $table->unsignedInteger('egg_id');
            $table->json('config')->nullable();
            $table->timestamps();

            $table->unique(['hosting_server_id', 'nest_id', 'egg_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pterodactyl_egg_configs');
    }
};
