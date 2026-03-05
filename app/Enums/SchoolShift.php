<?php

namespace App\Enums;

enum SchoolShift: string
{
    case Matutino = 'matutino';
    case Vespertino = 'vespertino';

    public function label(): string
    {
        return match ($this) {
            self::Matutino => 'Matutino',
            self::Vespertino => 'Vespertino',
        };
    }
}
