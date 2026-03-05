<?php

namespace App\Http\Requests;

use App\Enums\EducationLevel;
use App\Enums\GroupSpecialty;
use App\Enums\SchoolGrade;
use App\Enums\SchoolShift;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateGroupRequest extends FormRequest
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
        return (new StoreGroupRequest)->messages();
    }
}
