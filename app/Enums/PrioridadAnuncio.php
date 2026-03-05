<?php

namespace App\Enums;

enum PrioridadAnuncio: string
{
    case Normal = 'normal';
    case Urgente = 'urgente';

    public function label(): string
    {
        return match ($this) {
            self::Normal => 'Normal',
            self::Urgente => 'Urgente',
        };
    }
}
