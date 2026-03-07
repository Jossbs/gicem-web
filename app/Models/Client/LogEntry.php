<?php

namespace App\Models\Client;

use App\Enums\LogEntryCategory;
use Database\Factories\LogEntryFactory;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class LogEntry extends Model
{
    use HasFactory;

    protected $table = 'client.log_entries';

    protected static function newFactory(): Factory
    {
        return LogEntryFactory::new();
    }

    protected $guarded = [];

    protected function casts(): array
    {
        return [
            'fecha_nota' => 'date',
            'categoria' => LogEntryCategory::class,
            'notificar_padres' => 'boolean',
        ];
    }

    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class);
    }

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function getEvidenciaDisplayUrlAttribute(): ?string
    {
        return $this->evidencia_url ? Storage::url($this->evidencia_url) : null;
    }
}
