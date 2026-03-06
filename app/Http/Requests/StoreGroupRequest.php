<?php

namespace App\Http\Requests;

use App\Enums\EducationLevel;
use App\Enums\GroupSpecialty;
use App\Enums\SchoolGrade;
use App\Enums\SchoolShift;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\Rule;

class StoreGroupRequest extends FormRequest
{
    public function authorize(): bool
    {
        return Gate::allows('groups.manage');
    }

    /**
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'nombre_grupo' => ['required', 'string', 'max:255'],
            'docente_id' => ['required', Rule::exists(\App\Models\Client\User::class, 'id')],
            'nivel_educativo' => ['required', Rule::enum(EducationLevel::class)],
            'especialidad_grupo' => ['required', 'array', 'min:1'],
            'especialidad_grupo.*' => ['required', Rule::enum(GroupSpecialty::class)],
            'grado' => ['required', Rule::enum(SchoolGrade::class)],
            'turno' => ['required', Rule::enum(SchoolShift::class)],
            'aula_fisica' => ['required', 'string', 'max:255'],
            'capacidad_maxima' => ['required', 'integer', 'min:1', 'max:50'],
            'ciclo_escolar' => ['required', 'string', 'regex:/^\d{4}-\d{4}$/'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'nombre_grupo.required' => 'El nombre del grupo es obligatorio.',
            'docente_id.required' => 'Debe seleccionar un docente.',
            'docente_id.exists' => 'El docente seleccionado no existe.',
            'nivel_educativo.required' => 'El nivel educativo es obligatorio.',
            'especialidad_grupo.required' => 'Seleccione al menos una especialidad.',
            'especialidad_grupo.min' => 'Seleccione al menos una especialidad.',
            'grado.required' => 'El grado es obligatorio.',
            'turno.required' => 'El turno es obligatorio.',
            'aula_fisica.required' => 'El aula física es obligatoria.',
            'capacidad_maxima.required' => 'La capacidad máxima es obligatoria.',
            'capacidad_maxima.min' => 'La capacidad mínima es 1.',
            'capacidad_maxima.max' => 'La capacidad máxima es 50.',
            'ciclo_escolar.required' => 'El ciclo escolar es obligatorio.',
            'ciclo_escolar.regex' => 'El formato del ciclo escolar debe ser AAAA-AAAA (ej. 2025-2026).',
        ];
    }
}
