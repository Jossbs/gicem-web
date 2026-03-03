<?php

namespace App\Enums;

enum AutonomySkill: string
{
    case AlimentacionIndependiente = 'alimentacion_independiente';
    case ControlDeEsfinteres = 'control_de_esfinteres';
    case HigienePersonal = 'higiene_personal';
    case Vestido = 'vestido';
    case Desplazamiento = 'desplazamiento';
    case ComunicacionBasica = 'comunicacion_basica';

    public function label(): string
    {
        return match ($this) {
            self::AlimentacionIndependiente => 'Alimentación independiente',
            self::ControlDeEsfinteres => 'Control de esfínteres',
            self::HigienePersonal => 'Higiene personal',
            self::Vestido => 'Vestido',
            self::Desplazamiento => 'Desplazamiento',
            self::ComunicacionBasica => 'Comunicación básica',
        };
    }
}
