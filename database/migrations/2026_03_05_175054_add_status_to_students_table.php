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
        Schema::table('client.students', function (Blueprint $table) {
            $table->string('status')->default('completo')->after('tutor_user_id');

            // Make columns nullable so drafts can be saved with partial data
            $table->string('curp')->nullable()->change();
            $table->string('nombre_completo')->nullable()->change();
            $table->string('apellido_paterno')->nullable()->change();
            $table->string('apellido_materno')->nullable()->change();
            $table->date('fecha_nacimiento')->nullable()->change();
            $table->string('nacionalidad')->nullable()->change();
            $table->string('entidad_federativa')->nullable()->change();
            $table->string('genero')->nullable()->change();
            $table->string('institucion_medica')->nullable()->change();
            $table->string('tipo_sangre')->nullable()->change();
            $table->string('discapacidad')->nullable()->change();
            $table->text('diagnostico_medico')->nullable()->change();
            $table->text('alergias_graves')->nullable()->change();
            $table->text('uso_aparatos')->nullable()->change();
            $table->text('alerta_medica')->nullable()->change();
            $table->string('tutor_nombre')->nullable()->change();
            $table->string('tutor_apellido_paterno')->nullable()->change();
            $table->string('tutor_apellido_materno')->nullable()->change();
            $table->string('tutor_parentesco')->nullable()->change();
            $table->string('tel_emergencia_1')->nullable()->change();
            $table->string('correo_tutor')->nullable()->change();
            $table->string('domicilio_calle')->nullable()->change();
            $table->string('domicilio_numero')->nullable()->change();
            $table->string('domicilio_colonia')->nullable()->change();
            $table->string('domicilio_municipio')->nullable()->change();
            $table->string('domicilio_estado')->nullable()->change();
            $table->string('domicilio_cp')->nullable()->change();
            $table->string('comunicacion_tipo')->nullable()->change();
            $table->string('nivel_lectoescritura')->nullable()->change();
            $table->json('habilidades_autonomia')->nullable()->change();
            $table->text('intereses_alumnos')->nullable()->change();
            $table->text('detonantes_conducta')->nullable()->change();
            $table->date('fecha_ingreso')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('client.students', function (Blueprint $table) {
            $table->dropColumn('status');

            $table->string('curp')->nullable(false)->change();
            $table->string('nombre_completo')->nullable(false)->change();
            $table->string('apellido_paterno')->nullable(false)->change();
            $table->string('apellido_materno')->nullable(false)->change();
            $table->date('fecha_nacimiento')->nullable(false)->change();
            $table->string('nacionalidad')->nullable(false)->change();
            $table->string('entidad_federativa')->nullable(false)->change();
            $table->string('genero')->nullable(false)->change();
            $table->string('institucion_medica')->nullable(false)->change();
            $table->string('tipo_sangre')->nullable(false)->change();
            $table->string('discapacidad')->nullable(false)->change();
            $table->text('diagnostico_medico')->nullable(false)->change();
            $table->text('alergias_graves')->nullable(false)->change();
            $table->text('uso_aparatos')->nullable(false)->change();
            $table->text('alerta_medica')->nullable(false)->change();
            $table->string('tutor_nombre')->nullable(false)->change();
            $table->string('tutor_apellido_paterno')->nullable(false)->change();
            $table->string('tutor_apellido_materno')->nullable(false)->change();
            $table->string('tutor_parentesco')->nullable(false)->change();
            $table->string('tel_emergencia_1')->nullable(false)->change();
            $table->string('correo_tutor')->nullable(false)->change();
            $table->string('domicilio_calle')->nullable(false)->change();
            $table->string('domicilio_numero')->nullable(false)->change();
            $table->string('domicilio_colonia')->nullable(false)->change();
            $table->string('domicilio_municipio')->nullable(false)->change();
            $table->string('domicilio_estado')->nullable(false)->change();
            $table->string('domicilio_cp')->nullable(false)->change();
            $table->string('comunicacion_tipo')->nullable(false)->change();
            $table->string('nivel_lectoescritura')->nullable(false)->change();
            $table->json('habilidades_autonomia')->nullable(false)->change();
            $table->text('intereses_alumnos')->nullable(false)->change();
            $table->text('detonantes_conducta')->nullable(false)->change();
            $table->date('fecha_ingreso')->nullable(false)->change();
        });
    }
};
