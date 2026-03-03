<?php

namespace App\Enums;

enum LiteracyLevel: string
{
    case NoLee = 'no_lee';
    case Silabico = 'silabico';
    case Alfabetico = 'alfabetico';
    case Consolidado = 'consolidado';

    public function label(): string
    {
        return match ($this) {
            self::NoLee => 'No lee',
            self::Silabico => 'Silábico',
            self::Alfabetico => 'Alfabético',
            self::Consolidado => 'Consolidado',
        };
    }
}
