<?php

namespace App\Models\Client;

use App\Enums\SystemRole;
use App\Notifications\InvitationNotification;
use Database\Factories\UserFactory;
use Illuminate\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\Factory;
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

    protected static function newFactory(): Factory
    {
        return UserFactory::new();
    }

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

    public function groups(): HasMany
    {
        return $this->hasMany(Group::class, 'docente_id');
    }

    public function alumnos(): HasMany
    {
        return $this->hasMany(Student::class, 'tutor_user_id');
    }

    /**
     * @return array<int, string>
     */
    public function docenteGroupNames(): array
    {
        return $this->groups()->pluck('nombre_grupo')->all();
    }

    public function effectiveRole(): SystemRole
    {
        if ($this->rol_sistema !== SystemRole::Admin) {
            return $this->rol_sistema;
        }

        $impersonating = session('impersonating_role');

        if ($impersonating && SystemRole::tryFrom($impersonating)) {
            return SystemRole::from($impersonating);
        }

        return $this->rol_sistema;
    }

    public function isImpersonating(): bool
    {
        return $this->rol_sistema === SystemRole::Admin && session()->has('impersonating_role');
    }

    public function isAdmin(): bool
    {
        return $this->effectiveRole() === SystemRole::Admin;
    }

    public function isDocente(): bool
    {
        return $this->effectiveRole() === SystemRole::Docente;
    }

    public function isTrabajadorSocial(): bool
    {
        return $this->effectiveRole() === SystemRole::TrabajadorSocial;
    }

    public function isRealAdmin(): bool
    {
        return $this->rol_sistema === SystemRole::Admin;
    }

    public function sendPasswordResetNotification($token): void
    {
        $this->notify(new InvitationNotification($token));
    }

    public function getFotografiaDisplayUrlAttribute(): ?string
    {
        return $this->fotografia_url ? Storage::url($this->fotografia_url) : null;
    }
}
