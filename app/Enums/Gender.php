<?php

namespace App\Enums;

enum Gender: string
{
    case Femenino = 'femenino';
    case Masculino = 'masculino';
    case NoBinario = 'no_binario';
    case NoEspecificar = 'no_especificar';

    public function label(): string
    {
        return match ($this) {
            self::Femenino => 'Femenino',
            self::Masculino => 'Masculino',
            self::NoBinario => 'No binario',
            self::NoEspecificar => 'Prefiero no especificar',
        };
    }
}
