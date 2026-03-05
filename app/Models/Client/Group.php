<?php

namespace App\Models\Client;

use App\Enums\EducationLevel;
use App\Enums\SchoolGrade;
use App\Enums\SchoolShift;
use Database\Factories\GroupFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Group extends Model
{
    /** @use HasFactory<GroupFactory> */
    use HasFactory;

    protected $table = 'client.groups';

    protected $guarded = [];

    protected function casts(): array
    {
        return [
            'nivel_educativo' => EducationLevel::class,
            'grado' => SchoolGrade::class,
            'turno' => SchoolShift::class,
            'especialidad_grupo' => 'array',
            'capacidad_maxima' => 'integer',
        ];
    }

    public function docente(): BelongsTo
    {
        return $this->belongsTo(User::class, 'docente_id');
    }

    public function students(): HasMany
    {
        return $this->hasMany(Student::class, 'grado_grupo', 'nombre_grupo');
    }
}
