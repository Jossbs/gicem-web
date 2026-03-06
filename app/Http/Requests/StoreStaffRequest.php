<?php

namespace App\Http\Requests;

use App\Enums\SystemRole;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\Rule;

class StoreStaffRequest extends FormRequest
{
    public function authorize(): bool
    {
        return Gate::allows('staff.access');
    }

    /**
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'apellido_paterno' => ['required', 'string', 'max:255'],
            'apellido_materno' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', Rule::unique(\App\Models\Client\User::class, 'email')],
            'password' => [$this->boolean('enviar_invitacion') ? 'nullable' : 'required', 'string', 'min:8'],
            'enviar_invitacion' => ['boolean'],
            'rol_sistema' => ['required', Rule::enum(SystemRole::class)],
            'grupo_asignado_id' => ['nullable', Rule::exists(\App\Models\Client\Group::class, 'id')],
            'fotografia' => ['nullable', 'image', 'max:5120'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'name.required' => 'El nombre es obligatorio.',
            'apellido_paterno.required' => 'El apellido paterno es obligatorio.',
            'apellido_materno.required' => 'El apellido materno es obligatorio.',
            'email.required' => 'El correo electrónico es obligatorio.',
            'email.email' => 'Ingrese un correo electrónico válido.',
            'email.unique' => 'Este correo ya está registrado en el sistema.',
            'password.required' => 'La contraseña es obligatoria.',
            'password.min' => 'La contraseña debe tener al menos 8 caracteres.',
            'rol_sistema.required' => 'El rol del sistema es obligatorio.',
            'grupo_asignado_id.exists' => 'El grupo seleccionado no existe.',
            'fotografia.image' => 'La fotografía debe ser una imagen.',
            'fotografia.max' => 'La fotografía no debe pesar más de 5 MB.',
        ];
    }
}
