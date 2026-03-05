<?php

namespace Database\Factories;

use App\Enums\EducationLevel;
use App\Enums\GroupSpecialty;
use App\Enums\SchoolGrade;
use App\Enums\SchoolShift;
use App\Models\Client\Group;
use App\Models\Client\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Group>
 */
class GroupFactory extends Factory
{
    protected $model = Group::class;

    public function definition(): array
    {
        return [
            'nombre_grupo' => fake()->randomElement(['1-A', '1-B', '2-A', '2-B', '3-A', '3-B', 'Maternal-A', 'Laboral-1']),
            'docente_id' => User::factory(),
            'nivel_educativo' => fake()->randomElement(EducationLevel::cases()),
            'especialidad_grupo' => fake()->randomElements(
                array_column(GroupSpecialty::cases(), 'value'),
                fake()->numberBetween(1, 3),
            ),
            'grado' => fake()->randomElement(SchoolGrade::cases()),
            'turno' => fake()->randomElement(SchoolShift::cases()),
            'aula_fisica' => 'Aula '.fake()->numberBetween(1, 12),
            'capacidad_maxima' => fake()->numberBetween(8, 20),
            'ciclo_escolar' => '2025-2026',
        ];
    }
}
