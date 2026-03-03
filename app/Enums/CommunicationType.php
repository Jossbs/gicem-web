<?php

namespace App\Enums;

enum CommunicationType: string
{
    case Verbal = 'verbal';
    case NoVerbal = 'no_verbal';
    case Mixta = 'mixta';
    case LenguaDeSignos = 'lengua_de_signos';
    case Pictogramas = 'pictogramas';
    case Otra = 'otra';

    public function label(): string
    {
        return match ($this) {
            self::Verbal => 'Verbal',
            self::NoVerbal => 'No verbal',
            self::Mixta => 'Mixta',
            self::LenguaDeSignos => 'Lengua de signos',
            self::Pictogramas => 'Pictogramas',
            self::Otra => 'Otra',
        };
    }
}
