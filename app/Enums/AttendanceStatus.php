<?php

namespace App\Enums;

enum AttendanceStatus: string
{
    case Presente = 'presente';
    case Falta = 'falta';
    case Retardo = 'retardo';
    case Justificado = 'justificado';

    public function label(): string
    {
        return match ($this) {
            self::Presente => 'Presente',
            self::Falta => 'Falta',
            self::Retardo => 'Retardo',
            self::Justificado => 'Justificado',
        };
    }
}
