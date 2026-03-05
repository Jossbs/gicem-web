<?php

namespace App\Enums;

enum SchoolGrade: string
{
    case Primero = 'primero';
    case Segundo = 'segundo';
    case Tercero = 'tercero';
    case Cuarto = 'cuarto';
    case Quinto = 'quinto';
    case Sexto = 'sexto';
    case Unico = 'unico';

    public function label(): string
    {
        return match ($this) {
            self::Primero => '1°',
            self::Segundo => '2°',
            self::Tercero => '3°',
            self::Cuarto => '4°',
            self::Quinto => '5°',
            self::Sexto => '6°',
            self::Unico => 'Único',
        };
    }
}
