<?php

namespace Database\Factories;

use App\Enums\AttendanceStatus;
use App\Models\Client\Attendance;
use App\Models\Client\Student;
use App\Models\Client\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Attendance>
 */
class AttendanceFactory extends Factory
{
    protected $model = Attendance::class;

    public function definition(): array
    {
        return [
            'student_id' => Student::factory(),
            'recorded_by' => User::factory(),
            'fecha' => fake()->dateTimeBetween('-2 months', 'now'),
            'estatus' => fake()->randomElement([
                AttendanceStatus::Presente,
                AttendanceStatus::Presente,
                AttendanceStatus::Presente,
                AttendanceStatus::Presente,
                AttendanceStatus::Falta,
                AttendanceStatus::Retardo,
                AttendanceStatus::Justificado,
            ]),
            'observaciones' => fake()->optional(0.2)->sentence(5),
        ];
    }
}
