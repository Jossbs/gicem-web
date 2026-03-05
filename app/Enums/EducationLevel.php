<?php

namespace App\Enums;

enum EducationLevel: string
{
    case Maternal = 'maternal';
    case Preescolar = 'preescolar';
    case Primaria = 'primaria';
    case Secundaria = 'secundaria';
    case Laboral = 'laboral';

    public function label(): string
    {
        return match ($this) {
            self::Maternal => 'Maternal',
            self::Preescolar => 'Preescolar',
            self::Primaria => 'Primaria',
            self::Secundaria => 'Secundaria',
            self::Laboral => 'Laboral',
        };
    }
}
