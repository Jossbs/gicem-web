<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('client.groups', function (Blueprint $table): void {
            $table->id();
            $table->string('nombre_grupo');
            $table->foreignId('docente_id')->constrained('client.users');
            $table->string('nivel_educativo');
            $table->json('especialidad_grupo');
            $table->string('grado');
            $table->string('turno');
            $table->string('aula_fisica');
            $table->unsignedInteger('capacidad_maxima');
            $table->string('ciclo_escolar');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('client.groups');
    }
};
