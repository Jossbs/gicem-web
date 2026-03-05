<?php

namespace App\Models\Client;

use App\Enums\AlcanceAnuncio;
use App\Enums\PrioridadAnuncio;
use App\Enums\TipoEmisor;
use Database\Factories\AnuncioFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Anuncio extends Model
{
    /** @use HasFactory<AnuncioFactory> */
    use HasFactory;

    protected $table = 'client.anuncios';

    protected $fillable = [
        'user_id',
        'tipo_emisor',
        'alcance',
        'destinatario_tipo',
        'destinatario_id',
        'asunto',
        'mensaje',
        'prioridad',
        'adjunto_url',
        'fecha_envio',
    ];

    protected function casts(): array
    {
        return [
            'tipo_emisor' => TipoEmisor::class,
            'alcance' => AlcanceAnuncio::class,
            'prioridad' => PrioridadAnuncio::class,
            'fecha_envio' => 'datetime',
        ];
    }

    public function emisor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function destinatarioUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'destinatario_id');
    }

    public function destinatarioGrupo(): BelongsTo
    {
        return $this->belongsTo(Group::class, 'destinatario_id');
    }
}
