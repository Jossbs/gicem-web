<?php

namespace App\Enums;

enum DisabilityType: string
{
    case Intelectual = 'intelectual';
    case Motriz = 'motriz';
    case Visual = 'visual';
    case Auditiva = 'auditiva';
    case Psicosocial = 'psicosocial';
    case Multiple = 'multiple';
    case TeaAutismo = 'tea_autismo';
    case Otra = 'otra';

    public function label(): string
    {
        return match ($this) {
            self::Intelectual => 'Intelectual',
            self::Motriz => 'Motriz',
            self::Visual => 'Visual',
            self::Auditiva => 'Auditiva',
            self::Psicosocial => 'Psicosocial',
            self::Multiple => 'Múltiple',
            self::TeaAutismo => 'TEA / Autismo',
            self::Otra => 'Otra',
        };
    }
}
