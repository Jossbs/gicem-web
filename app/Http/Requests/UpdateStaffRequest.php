<?php

namespace App\Http\Requests;

use App\Enums\SystemRole;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateStaffRequest extends FormRequest
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
            'name' => ['required', 'string', 'max:255'],
            'apellido_paterno' => ['required', 'string', 'max:255'],
            'apellido_materno' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', Rule::unique(\App\Models\Client\User::class, 'email')->ignore($this->staff)],
            'password' => ['nullable', 'string', 'min:8'],
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
        return (new StoreStaffRequest)->messages();
    }
}
