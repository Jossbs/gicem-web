<?php

namespace App\Enums;

enum MedicalInstitution: string
{
    case Imss = 'imss';
    case Issste = 'issste';
    case SeguroPopular = 'seguro_popular';
    case InsabiBienestar = 'insabi_bienestar';
    case Particular = 'particular';
    case Otra = 'otra';
    case Ninguna = 'ninguna';

    public function label(): string
    {
        return match ($this) {
            self::Imss => 'IMSS',
            self::Issste => 'ISSSTE',
            self::SeguroPopular => 'Seguro Popular',
            self::InsabiBienestar => 'INSABI / Bienestar',
            self::Particular => 'Particular',
            self::Otra => 'Otra',
            self::Ninguna => 'Ninguna',
        };
    }
}
