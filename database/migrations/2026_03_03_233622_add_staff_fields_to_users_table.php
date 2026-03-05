<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('client.users', function (Blueprint $table): void {
            $table->string('apellido_paterno')->nullable()->after('name');
            $table->string('apellido_materno')->nullable()->after('apellido_paterno');
            $table->string('rol_sistema')->default('docente')->after('apellido_materno');
            $table->foreignId('grupo_asignado_id')->nullable()->after('rol_sistema')->constrained('client.groups');
            $table->string('fotografia_url')->nullable()->after('grupo_asignado_id');
        });
    }

    public function down(): void
    {
        Schema::table('client.users', function (Blueprint $table): void {
            $table->dropForeign(['grupo_asignado_id']);
            $table->dropColumn(['apellido_paterno', 'apellido_materno', 'rol_sistema', 'grupo_asignado_id', 'fotografia_url']);
        });
    }
};
