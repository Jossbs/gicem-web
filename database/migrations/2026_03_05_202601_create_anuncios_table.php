<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('client.anuncios', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('user_id')->constrained('client.users');
            $table->string('tipo_emisor');
            $table->string('alcance');
            $table->string('destinatario_tipo')->nullable();
            $table->unsignedBigInteger('destinatario_id')->nullable();
            $table->string('asunto');
            $table->text('mensaje');
            $table->string('prioridad')->default('normal');
            $table->string('adjunto_url')->nullable();
            $table->timestamp('fecha_envio')->useCurrent();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('client.anuncios');
    }
};
