<?php

namespace App\Http\Requests;

use App\Enums\LogEntryCategory;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\Rule;

class StoreLogEntryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return Gate::allows('log-entries.create');
    }

    /**
     * @return array<string, array<int, mixed>>
     */
    public function rules(): array
    {
        return [
            'fecha_nota' => ['required', 'date'],
            'categoria' => ['required', Rule::enum(LogEntryCategory::class)],
            'descripcion' => ['required', 'string', 'max:5000'],
            'evidencia' => ['nullable', 'image', 'max:5120'],
            'notificar_padres' => ['required', 'boolean'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'fecha_nota.required' => 'La fecha es obligatoria.',
            'fecha_nota.date' => 'La fecha no es válida.',
            'categoria.required' => 'El tipo de registro es obligatorio.',
            'categoria.enum' => 'El tipo de registro seleccionado no es válido.',
            'descripcion.required' => 'Las observaciones son obligatorias.',
            'descripcion.max' => 'Las observaciones no deben exceder 5000 caracteres.',
            'evidencia.image' => 'La evidencia debe ser una imagen.',
            'evidencia.max' => 'La imagen no debe exceder 5 MB.',
            'notificar_padres.required' => 'Indica si se debe notificar a los padres.',
            'notificar_padres.boolean' => 'El campo de notificación debe ser verdadero o falso.',
        ];
    }
}
