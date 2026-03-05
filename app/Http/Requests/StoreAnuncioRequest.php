<?php

namespace App\Http\Requests;

use App\Enums\AlcanceAnuncio;
use App\Enums\PrioridadAnuncio;
use App\Enums\TipoEmisor;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreAnuncioRequest extends FormRequest
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
            'tipo_emisor' => ['required', Rule::enum(TipoEmisor::class)],
            'alcance' => ['required', Rule::enum(AlcanceAnuncio::class)],
            'asunto' => ['required', 'string', 'max:255'],
            'mensaje' => ['required', 'string'],
            'prioridad' => ['required', Rule::enum(PrioridadAnuncio::class)],
            'adjunto' => ['nullable', 'file', 'max:5120'],
            'destinatario_id' => [
                Rule::requiredIf(fn () => in_array($this->input('alcance'), ['grupo', 'privado'])),
                'nullable',
                'integer',
            ],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'tipo_emisor.required' => 'El tipo de emisor es obligatorio.',
            'alcance.required' => 'El alcance del anuncio es obligatorio.',
            'asunto.required' => 'El asunto es obligatorio.',
            'asunto.max' => 'El asunto no debe exceder 255 caracteres.',
            'mensaje.required' => 'El mensaje es obligatorio.',
            'prioridad.required' => 'La prioridad es obligatoria.',
            'adjunto.file' => 'El adjunto debe ser un archivo válido.',
            'adjunto.max' => 'El adjunto no debe pesar más de 5 MB.',
            'destinatario_id.required' => 'Debe seleccionar un destinatario.',
        ];
    }
}
