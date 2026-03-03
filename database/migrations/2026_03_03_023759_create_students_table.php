<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
public function up(): void
{
// Usamos el esquema 'client' como en tu modelo User
if (!Schema::hasTable('client.students')) {
Schema::create('client.students', function (Blueprint $table) {
$table->id();

// --- Identificación y Datos Generales  ---
$table->string('status')->default('borrador'); // Para controlar el pre-guardado vs activo
$table->string('first_name'); // nombre_completo
$table->string('paternal_surname'); // apellido_paterno
$table->string('maternal_surname'); // apellido_materno
$table->string('curp', 18)->unique()->nullable();
$table->date('birth_date')->nullable();
$table->string('nationality')->nullable(); // nacionalidad
$table->string('birth_state')->nullable(); // entidad_federativa
$table->string('gender')->nullable(); // genero (Catálogo)
$table->string('photo_path')->nullable(); // fotografia_url

// Archivos de Identificación
$table->string('birth_certificate_path')->nullable(); // doc_acta_nacimiento
$table->string('curp_path')->nullable(); // curp_alumno (archivo)

// --- Perfil de Salud y Discapacidad  ---
$table->unsignedBigInteger('nss')->nullable();
$table->string('nss_file_path')->nullable(); // nss_original
$table->string('disability_certificate_path')->nullable(); // doc_cert_discapacidad
$table->string('medical_institution')->nullable();
$table->string('blood_type')->nullable(); // tipo_sangre
$table->string('primary_disability')->nullable(); // discapacidad
$table->text('clinical_diagnosis')->nullable(); // diagnostico_medico
$table->string('comorbidities')->nullable(); // comorbilidades (No obligatorio)
$table->string('severe_allergies')->nullable(); // alergias graves
$table->text('technical_aids')->nullable(); // uso aparatos
$table->text('school_medication')->nullable(); // medicacion_escolar (desglosar en JSON si es necesario)
$table->text('medical_alert')->nullable(); // alerta medica

// --- Entorno Familiar y Contacto  ---
$table->string('address_street')->nullable(); // domicilio dividido
$table->string('address_number')->nullable();
$table->string('address_colony')->nullable();
$table->string('address_zip_code')->nullable();

$table->string('guardian_name')->nullable(); // tutor_nombre
$table->string('guardian_relationship')->nullable(); // tutor_parentesco
$table->string('guardian_email')->nullable(); // correo_tutor
$table->string('emergency_phone_1')->nullable(); // tel_emergencia_1
$table->string('emergency_phone_2')->nullable(); // tel_emergencia_2 (Opcional)

$table->string('address_proof_path')->nullable(); // comprobante_domicilio
$table->string('guardian_ine_path')->nullable(); // ine tutor

// --- Perfil Psicopedagógico [cite: 4] ---
$table->string('communication_style')->nullable(); // comunicacion_tipo
$table->string('literacy_level')->nullable(); // nivel lectoescritura
$table->text('interests')->nullable(); // intereses alumnos
$table->text('behavioral_triggers')->nullable(); // detonantes conducta
$table->text('autonomy_skills')->nullable(); // habilidades autonomia

// --- Control Administrativo [cite: 4] ---
$table->string('enrollment_status')->default('Activo'); // estatus alumno
$table->date('admission_date')->useCurrent(); // fecha ingreso
// Asumo relación con un modelo Group
$table->foreignId('group_id')->nullable()->constrained('client.groups');

$table->timestamps();
});
}
}

public function down(): void
{
Schema::dropIfExists('client.students');
}
};
