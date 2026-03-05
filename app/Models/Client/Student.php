<?php

namespace App\Models\Client;

use App\Enums\BloodType;
use App\Enums\CommunicationType;
use App\Enums\DisabilityType;
use App\Enums\Gender;
use App\Enums\Kinship;
use App\Enums\LiteracyLevel;
use App\Enums\MedicalInstitution;
use App\Enums\StudentStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class Student extends Model
{
    use HasFactory;

    protected $table = 'client.students';

    protected $guarded = [];

    protected function casts(): array
    {
        return [
            'fecha_nacimiento' => 'date',
            'fecha_ingreso' => 'date',
            'genero' => Gender::class,
            'institucion_medica' => MedicalInstitution::class,
            'tipo_sangre' => BloodType::class,
            'discapacidad' => DisabilityType::class,
            'tutor_parentesco' => Kinship::class,
            'comunicacion_tipo' => CommunicationType::class,
            'nivel_lectoescritura' => LiteracyLevel::class,
            'habilidades_autonomia' => 'array',
            'estatus_alumno' => StudentStatus::class,
        ];
    }

    public function tutorUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'tutor_user_id');
    }

    public function getNombreCompletoDisplayAttribute(): string
    {
        return "{$this->apellido_paterno} {$this->apellido_materno}, {$this->nombre_completo}";
    }

    public function getFotografiaDisplayUrlAttribute(): ?string
    {
        return $this->fotografia_url ? Storage::url($this->fotografia_url) : null;
    }

    public function getDocActaNacimientoUrlAttribute(): ?string
    {
        return $this->doc_acta_nacimiento ? Storage::url($this->doc_acta_nacimiento) : null;
    }

    public function getCurpAlumnoDocUrlAttribute(): ?string
    {
        return $this->curp_alumno_doc ? Storage::url($this->curp_alumno_doc) : null;
    }

    public function getDocCertDiscapacidadUrlAttribute(): ?string
    {
        return $this->doc_cert_discapacidad ? Storage::url($this->doc_cert_discapacidad) : null;
    }

    public function getNssOriginalDocUrlAttribute(): ?string
    {
        return $this->nss_original_doc ? Storage::url($this->nss_original_doc) : null;
    }

    public function getComprobanteDomicilioDocUrlAttribute(): ?string
    {
        return $this->comprobante_domicilio_doc ? Storage::url($this->comprobante_domicilio_doc) : null;
    }

    public function getIneTutorDocUrlAttribute(): ?string
    {
        return $this->ine_tutor_doc ? Storage::url($this->ine_tutor_doc) : null;
    }
}
