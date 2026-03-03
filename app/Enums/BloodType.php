<?php

namespace App\Enums;

enum BloodType: string
{
    case OPositivo = 'o_positivo';
    case ONegativo = 'o_negativo';
    case APositivo = 'a_positivo';
    case ANegativo = 'a_negativo';
    case BPositivo = 'b_positivo';
    case BNegativo = 'b_negativo';
    case AbPositivo = 'ab_positivo';
    case AbNegativo = 'ab_negativo';

    public function label(): string
    {
        return match ($this) {
            self::OPositivo => 'O+',
            self::ONegativo => 'O-',
            self::APositivo => 'A+',
            self::ANegativo => 'A-',
            self::BPositivo => 'B+',
            self::BNegativo => 'B-',
            self::AbPositivo => 'AB+',
            self::AbNegativo => 'AB-',
        };
    }
}
