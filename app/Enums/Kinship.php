<?php

namespace App\Enums;

enum Kinship: string
{
    case Madre = 'madre';
    case Padre = 'padre';
    case Abuelo = 'abuelo';
    case TutorLegal = 'tutor_legal';

    public function label(): string
    {
        return match ($this) {
            self::Madre => 'Madre',
            self::Padre => 'Padre',
            self::Abuelo => 'Abuelo/a',
            self::TutorLegal => 'Tutor legal',
        };
    }
}
