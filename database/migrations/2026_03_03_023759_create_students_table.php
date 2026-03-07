<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('client.students', function (Blueprint $table): void {
            $table->id();

            // Identificacion y datos generales
            $table->string('curp', 18)->unique()->nullable();
            $table->string('nombre_completo');
            $table->string('apellido_paterno');
            $table->string('apellido_materno');
            $table->date('fecha_nacimiento')->nullable();
            $table->string('nacionalidad')->nullable();
            $table->string('entidad_federativa')->nullable();
            $table->string('genero')->nullable();
            $table->string('fotografia_url')->nullable();

            // Archivos de identificacion
            $table->string('doc_acta_nacimiento')->nullable();
            $table->string('curp_alumno_doc')->nullable();

            // Perfil de salud y discapacidad
            $table->string('nss')->nullable();
            $table->string('nss_original_doc')->nullable();
            $table->string('doc_cert_discapacidad')->nullable();
            $table->string('institucion_medica')->nullable();
            $table->string('tipo_sangre')->nullable();
            $table->string('discapacidad')->nullable();
            $table->text('diagnostico_medico')->nullable();
            $table->string('comorbilidades')->nullable();
            $table->text('alergias_graves')->nullable();
            $table->text('uso_aparatos')->nullable();
            $table->string('medicacion_nombre')->nullable();
            $table->string('medicacion_dosis')->nullable();
            $table->string('medicacion_horario')->nullable();
            $table->text('alerta_medica')->nullable();

            // Entorno familiar y contacto
            $table->string('tutor_nombre')->nullable();
            $table->string('tutor_apellido_paterno')->nullable();
            $table->string('tutor_apellido_materno')->nullable();
            $table->string('tutor_parentesco')->nullable();
            $table->string('tel_emergencia_1')->nullable();
            $table->string('tel_emergencia_2')->nullable();
            $table->string('correo_tutor')->nullable();
            $table->string('domicilio_calle')->nullable();
            $table->string('domicilio_numero')->nullable();
            $table->string('domicilio_colonia')->nullable();
            $table->string('domicilio_municipio')->nullable();
            $table->string('domicilio_estado')->nullable();
            $table->string('domicilio_cp')->nullable();
            $table->string('comprobante_domicilio_doc')->nullable();
            $table->string('ine_tutor_doc')->nullable();

            // Perfil psicopedagogico
            $table->string('comunicacion_tipo')->nullable();
            $table->string('nivel_lectoescritura')->nullable();
            $table->json('habilidades_autonomia')->nullable();
            $table->text('intereses_alumnos')->nullable();
            $table->text('detonantes_conducta')->nullable();

            // Control administrativo
            $table->string('estatus_alumno')->default('activo');
            $table->string('status')->default('completo');
            $table->date('fecha_ingreso')->nullable();
            $table->string('grado_grupo')->nullable();
            $table->foreignId('tutor_user_id')->nullable()->constrained('client.users')->nullOnDelete();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('client.students');
    }
};
