<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('client.attendances', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('student_id')->constrained('client.students')->cascadeOnDelete();
            $table->foreignId('recorded_by')->constrained('client.users')->cascadeOnDelete();
            $table->date('fecha');
            $table->string('estatus');
            $table->text('observaciones')->nullable();
            $table->timestamps();

            $table->unique(['student_id', 'fecha']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('client.attendances');
    }
};
