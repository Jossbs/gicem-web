<?php

namespace App\Enums;

enum StudentStatus: string
{
    case Activo = 'activo';
    case BajaTemporal = 'baja_temporal';
    case Egresado = 'egresado';

    public function label(): string
    {
        return match ($this) {
            self::Activo => 'Activo',
            self::BajaTemporal => 'Baja temporal',
            self::Egresado => 'Egresado',
        };
    }
}
