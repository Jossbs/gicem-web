<?php

namespace App\Models\Client;

use App\Enums\SystemRole;
use Database\Factories\UserFactory;
use Illuminate\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Storage;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, MustVerifyEmail, Notifiable;

    protected $table = 'client.users';

    protected $fillable = [
        'name',
        'apellido_paterno',
        'apellido_materno',
        'email',
        'password',
        'email_verified_at',
        'rol_sistema',
        'grupo_asignado_id',
        'fotografia_url',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'rol_sistema' => SystemRole::class,
        ];
    }

    public function grupoAsignado(): BelongsTo
    {
        return $this->belongsTo(Group::class, 'grupo_asignado_id');
    }

    public function alumnos(): HasMany
    {
        return $this->hasMany(Student::class, 'tutor_user_id');
    }

    public function isAdmin(): bool
    {
        return $this->rol_sistema === SystemRole::Admin;
    }

    public function isDocente(): bool
    {
        return $this->rol_sistema === SystemRole::Docente;
    }

    public function isTrabajadorSocial(): bool
    {
        return $this->rol_sistema === SystemRole::TrabajadorSocial;
    }

    public function getFotografiaDisplayUrlAttribute(): ?string
    {
        return $this->fotografia_url ? Storage::url($this->fotografia_url) : null;
    }
}
