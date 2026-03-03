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

class StoreStudentRequest extends FormRequest
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
            // Paso 1 — Datos generales
            'curp' => ['required', 'string', 'size:18', 'regex:/^[A-Z]{4}\d{6}[HM][A-Z]{5}[A-Z0-9]\d$/i', 'unique:client.students,curp'],
            'nombre_completo' => ['required', 'string', 'max:255'],
            'apellido_paterno' => ['required', 'string', 'max:255'],
            'apellido_materno' => ['required', 'string', 'max:255'],
            'fecha_nacimiento' => ['required', 'date', 'before:today'],
            'nacionalidad' => ['required', 'string', 'max:100'],
            'entidad_federativa' => ['required', 'string', 'max:100'],
            'genero' => ['required', Rule::enum(Gender::class)],
            'fotografia' => ['nullable', 'image', 'max:5120'],
            'doc_acta_nacimiento' => ['nullable', 'file', 'mimes:pdf', 'max:5120'],
            'curp_alumno_doc' => ['nullable', 'file', 'mimes:pdf', 'max:5120'],

            // Paso 2 — Salud
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

            // Paso 3 — Familia / Tutor
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

            // Paso 4 — Psicopedagógico
            'comunicacion_tipo' => ['required', Rule::enum(CommunicationType::class)],
            'nivel_lectoescritura' => ['required', Rule::enum(LiteracyLevel::class)],
            'habilidades_autonomia' => ['required', 'array', 'min:1'],
            'habilidades_autonomia.*' => ['required', Rule::enum(AutonomySkill::class)],
            'intereses_alumnos' => ['required', 'string', 'max:2000'],
            'detonantes_conducta' => ['required', 'string', 'max:2000'],

            // Paso 5 — Estatus
            'estatus_alumno' => ['required', Rule::enum(StudentStatus::class)],
            'grado_grupo' => ['nullable', 'string', 'max:20'],
            'fecha_ingreso' => ['required', 'date'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'curp.required' => 'La CURP es obligatoria.',
            'curp.size' => 'La CURP debe tener exactamente 18 caracteres.',
            'curp.regex' => 'El formato de la CURP no es válido.',
            'curp.unique' => 'Esta CURP ya está registrada en el sistema.',
            'nombre_completo.required' => 'El nombre es obligatorio.',
            'apellido_paterno.required' => 'El apellido paterno es obligatorio.',
            'apellido_materno.required' => 'El apellido materno es obligatorio.',
            'fecha_nacimiento.required' => 'La fecha de nacimiento es obligatoria.',
            'fecha_nacimiento.before' => 'La fecha de nacimiento debe ser anterior a hoy.',
            'nacionalidad.required' => 'La nacionalidad es obligatoria.',
            'entidad_federativa.required' => 'La entidad federativa es obligatoria.',
            'genero.required' => 'El género es obligatorio.',
            'fotografia.image' => 'La fotografía debe ser una imagen.',
            'fotografia.max' => 'La fotografía no debe pesar más de 5 MB.',
            'doc_acta_nacimiento.mimes' => 'El acta de nacimiento debe ser un archivo PDF.',
            'doc_acta_nacimiento.max' => 'El acta de nacimiento no debe pesar más de 5 MB.',
            'institucion_medica.required' => 'La institución médica es obligatoria.',
            'tipo_sangre.required' => 'El tipo de sangre es obligatorio.',
            'discapacidad.required' => 'El tipo de discapacidad es obligatorio.',
            'diagnostico_medico.required' => 'El diagnóstico médico es obligatorio.',
            'alergias_graves.required' => 'Las alergias son obligatorias. Si no tiene, escriba "Ninguna".',
            'uso_aparatos.required' => 'Indique el uso de aparatos. Si no usa, escriba "Ninguno".',
            'alerta_medica.required' => 'La alerta médica es obligatoria. Si no hay, escriba "Ninguna".',
            'tutor_nombre.required' => 'El nombre del tutor es obligatorio.',
            'tutor_apellido_paterno.required' => 'El apellido paterno del tutor es obligatorio.',
            'tutor_apellido_materno.required' => 'El apellido materno del tutor es obligatorio.',
            'tutor_parentesco.required' => 'El parentesco del tutor es obligatorio.',
            'tel_emergencia_1.required' => 'El teléfono de emergencia es obligatorio.',
            'correo_tutor.required' => 'El correo del tutor es obligatorio.',
            'correo_tutor.email' => 'Ingrese un correo electrónico válido.',
            'domicilio_calle.required' => 'La calle es obligatoria.',
            'domicilio_numero.required' => 'El número es obligatorio.',
            'domicilio_colonia.required' => 'La colonia es obligatoria.',
            'domicilio_municipio.required' => 'El municipio es obligatorio.',
            'domicilio_estado.required' => 'El estado es obligatorio.',
            'domicilio_cp.required' => 'El código postal es obligatorio.',
            'domicilio_cp.size' => 'El código postal debe tener 5 dígitos.',
            'domicilio_cp.regex' => 'El código postal debe contener solo números.',
            'comunicacion_tipo.required' => 'El tipo de comunicación es obligatorio.',
            'nivel_lectoescritura.required' => 'El nivel de lectoescritura es obligatorio.',
            'habilidades_autonomia.required' => 'Seleccione al menos una habilidad de autonomía.',
            'habilidades_autonomia.min' => 'Seleccione al menos una habilidad de autonomía.',
            'intereses_alumnos.required' => 'Los intereses del alumno son obligatorios.',
            'detonantes_conducta.required' => 'Los detonantes de conducta son obligatorios.',
            'estatus_alumno.required' => 'El estatus es obligatorio.',
            'fecha_ingreso.required' => 'La fecha de ingreso es obligatoria.',
        ];
    }
}
