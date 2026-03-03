<?php

namespace Database\Factories;

use App\Enums\AutonomySkill;
use App\Enums\BloodType;
use App\Enums\CommunicationType;
use App\Enums\DisabilityType;
use App\Enums\Gender;
use App\Enums\Kinship;
use App\Enums\LiteracyLevel;
use App\Enums\MedicalInstitution;
use App\Enums\StudentStatus;
use App\Models\Client\Student;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Student>
 */
class StudentFactory extends Factory
{
    protected $model = Student::class;

    public function definition(): array
    {
        $curpLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        $curp = '';
        for ($i = 0; $i < 4; $i++) {
            $curp .= $curpLetters[random_int(0, 25)];
        }
        $curp .= fake()->numerify('######');
        for ($i = 0; $i < 6; $i++) {
            $curp .= $curpLetters[random_int(0, 25)];
        }
        $curp .= fake()->numerify('##');

        return [
            'curp' => $curp,
            'nombre_completo' => fake()->firstName(),
            'apellido_paterno' => fake()->lastName(),
            'apellido_materno' => fake()->lastName(),
            'fecha_nacimiento' => fake()->dateTimeBetween('-18 years', '-3 years'),
            'nacionalidad' => 'Mexicana',
            'entidad_federativa' => fake()->randomElement([
                'Aguascalientes', 'Baja California', 'Chihuahua', 'Ciudad de México',
                'Jalisco', 'Nuevo León', 'Puebla', 'Querétaro', 'Sonora',
            ]),
            'genero' => fake()->randomElement(Gender::cases()),

            // Salud
            'nss' => fake()->numerify('###########'),
            'institucion_medica' => fake()->randomElement(MedicalInstitution::cases()),
            'tipo_sangre' => fake()->randomElement(BloodType::cases()),
            'discapacidad' => fake()->randomElement(DisabilityType::cases()),
            'diagnostico_medico' => fake()->sentence(8),
            'comorbilidades' => fake()->optional()->sentence(4),
            'alergias_graves' => fake()->sentence(3),
            'uso_aparatos' => fake()->randomElement(['Ninguno', 'Silla de ruedas', 'Auxiliar auditivo', 'Lentes']),
            'medicacion_nombre' => fake()->optional()->word(),
            'medicacion_dosis' => fake()->optional()->word(),
            'medicacion_horario' => fake()->optional()->randomElement(['Mañana', 'Tarde', 'Noche']),
            'alerta_medica' => fake()->sentence(5),

            // Tutor
            'tutor_nombre' => fake()->firstName(),
            'tutor_apellido_paterno' => fake()->lastName(),
            'tutor_apellido_materno' => fake()->lastName(),
            'tutor_parentesco' => fake()->randomElement(Kinship::cases()),
            'tel_emergencia_1' => fake()->numerify('##########'),
            'tel_emergencia_2' => fake()->optional()->numerify('##########'),
            'correo_tutor' => fake()->safeEmail(),
            'domicilio_calle' => fake()->streetName(),
            'domicilio_numero' => fake()->buildingNumber(),
            'domicilio_colonia' => 'Centro',
            'domicilio_municipio' => fake()->city(),
            'domicilio_estado' => 'Sonora',
            'domicilio_cp' => fake()->numerify('#####'),

            // Psicopedagógico
            'comunicacion_tipo' => fake()->randomElement(CommunicationType::cases()),
            'nivel_lectoescritura' => fake()->randomElement(LiteracyLevel::cases()),
            'habilidades_autonomia' => fake()->randomElements(
                array_column(AutonomySkill::cases(), 'value'),
                fake()->numberBetween(1, 4),
            ),
            'intereses_alumnos' => fake()->sentence(6),
            'detonantes_conducta' => fake()->sentence(6),

            // Estatus
            'estatus_alumno' => StudentStatus::Activo,
            'grado_grupo' => fake()->optional()->randomElement(['1-A', '2-A', '3-A', '1-B', '2-B']),
            'fecha_ingreso' => fake()->dateTimeBetween('-2 years', 'now'),
        ];
    }
}
