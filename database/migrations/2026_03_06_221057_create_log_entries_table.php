<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('client.log_entries', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('student_id')->constrained('client.students')->cascadeOnDelete();
            $table->foreignId('created_by')->constrained('client.users')->cascadeOnDelete();
            $table->date('fecha_nota');
            $table->string('categoria');
            $table->text('descripcion');
            $table->string('evidencia_url')->nullable();
            $table->boolean('notificar_padres')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('client.log_entries');
    }
};
