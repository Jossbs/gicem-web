<?php

namespace App\Enums;

enum LogEntryCategory: string
{
    case Logro = 'logro';
    case Conducta = 'conducta';
    case Salud = 'salud';
    case Incidente = 'incidente';

    public function label(): string
    {
        return match ($this) {
            self::Logro => 'Logro',
            self::Conducta => 'Conducta',
            self::Salud => 'Salud',
            self::Incidente => 'Incidente',
        };
    }
}
