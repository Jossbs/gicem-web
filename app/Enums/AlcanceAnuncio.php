<?php

namespace App\Enums;

enum AlcanceAnuncio: string
{
    case Grupo = 'grupo';
    case Escuela = 'escuela';
    case Privado = 'privado';

    public function label(): string
    {
        return match ($this) {
            self::Grupo => 'Todo el Grupo',
            self::Escuela => 'Toda la Escuela',
            self::Privado => 'Privado',
        };
    }
}
