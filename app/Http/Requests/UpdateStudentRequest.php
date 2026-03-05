<?php

namespace App\Http\Requests;

use App\Enums\AutonomySkill;
use App\Enums\BloodType;
use App\Enums\CommunicationType;
use App\Enums\DisabilityType;
use App\Enums\Gender;
use App\Enums\Kinship;
use App\Enums\LiteracyLevel;
use App\Enums\MedicalInstitution;
use App\Enums\StudentStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateStudentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'curp' => ['required', 'string', 'size:18', 'regex:/^[A-Z]{4}\d{6}[HM][A-Z]{5}[A-Z0-9]\d$/i', Rule::unique(\App\Models\Client\Student::class, 'curp')->ignore($this->route('student'))],
            'nombre_completo' => ['required', 'string', 'max:255'],
            'apellido_paterno' => ['required', 'string', 'max:255'],
            'apellido_materno' => ['required', 'string', 'max:255'],
            'fecha_nacimiento' => ['required', 'date', 'before:today'],
            'nacionalidad' => ['required', 'string', 'max:100'],
            'entidad_federativa' => ['required', 'string', 'max:100'],
            'genero' => ['required', Rule::enum(Gender::class)],
            'fotografia' => ['nullable', 'image', 'max:5120'],
            'nss' => ['nullable', 'string', 'max:20'],
            'institucion_medica' => ['required', Rule::enum(MedicalInstitution::class)],
            'tipo_sangre' => ['required', Rule::enum(BloodType::class)],
            'discapacidad' => ['required', Rule::enum(DisabilityType::class)],
            'diagnostico_medico' => ['required', 'string', 'max:2000'],
            'comorbilidades' => ['nullable', 'string', 'max:2000'],
            'alergias_graves' => ['required', 'string', 'max:1000'],
            'uso_aparatos' => ['required', 'string', 'max:500'],
            'medicacion_nombre' => ['nullable', 'string', 'max:255'],
            'medicacion_dosis' => ['nullable', 'string', 'max:255'],
            'medicacion_horario' => ['nullable', 'string', 'max:255'],
            'alerta_medica' => ['required', 'string', 'max:2000'],
            'doc_cert_discapacidad' => ['nullable', 'file', 'mimes:pdf', 'max:5120'],
            'nss_original_doc' => ['nullable', 'file', 'mimes:pdf', 'max:5120'],
            'tutor_nombre' => ['required', 'string', 'max:255'],
            'tutor_apellido_paterno' => ['required', 'string', 'max:255'],
            'tutor_apellido_materno' => ['required', 'string', 'max:255'],
            'tutor_parentesco' => ['required', Rule::enum(Kinship::class)],
            'tel_emergencia_1' => ['required', 'string', 'max:15'],
            'tel_emergencia_2' => ['nullable', 'string', 'max:15'],
            'correo_tutor' => ['required', 'email', 'max:255'],
            'domicilio_calle' => ['required', 'string', 'max:255'],
            'domicilio_numero' => ['required', 'string', 'max:20'],
            'domicilio_colonia' => ['required', 'string', 'max:255'],
            'domicilio_municipio' => ['required', 'string', 'max:255'],
            'domicilio_estado' => ['required', 'string', 'max:100'],
            'domicilio_cp' => ['required', 'string', 'size:5', 'regex:/^\d{5}$/'],
            'comprobante_domicilio_doc' => ['nullable', 'file', 'mimes:pdf', 'max:5120'],
            'ine_tutor_doc' => ['nullable', 'file', 'mimes:pdf', 'max:5120'],
            'comunicacion_tipo' => ['required', Rule::enum(CommunicationType::class)],
            'nivel_lectoescritura' => ['required', Rule::enum(LiteracyLevel::class)],
            'habilidades_autonomia' => ['required', 'array', 'min:1'],
            'habilidades_autonomia.*' => ['required', Rule::enum(AutonomySkill::class)],
            'intereses_alumnos' => ['required', 'string', 'max:2000'],
            'detonantes_conducta' => ['required', 'string', 'max:2000'],
            'estatus_alumno' => ['required', Rule::enum(StudentStatus::class)],
            'grado_grupo' => ['nullable', 'string', 'max:20'],
            'fecha_ingreso' => ['required', 'date'],
            'doc_acta_nacimiento' => ['nullable', 'file', 'mimes:pdf', 'max:5120'],
            'curp_alumno_doc' => ['nullable', 'file', 'mimes:pdf', 'max:5120'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return (new StoreStudentRequest)->messages();
    }
}
