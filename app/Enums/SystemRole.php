<?php

namespace App\Enums;

enum SystemRole: string
{
    case Admin = 'admin';
    case TrabajadorSocial = 'trabajador_social';
    case Docente = 'docente';
    case Tutor = 'tutor';

    public function label(): string
    {
        return match ($this) {
            self::Admin => 'Administrador',
            self::TrabajadorSocial => 'Trabajador Social',
            self::Docente => 'Docente',
            self::Tutor => 'Tutor',
        };
    }
}
