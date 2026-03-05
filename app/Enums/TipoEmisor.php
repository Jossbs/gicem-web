<?php

namespace App\Enums;

enum TipoEmisor: string
{
    case Admin = 'admin';
    case Docente = 'docente';
    case Tutor = 'tutor';

    public function label(): string
    {
        return match ($this) {
            self::Admin => 'Administrador',
            self::Docente => 'Docente',
            self::Tutor => 'Tutor',
        };
    }
}
