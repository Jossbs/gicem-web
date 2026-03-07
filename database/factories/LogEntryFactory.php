<?php

namespace Database\Factories;

use App\Enums\LogEntryCategory;
use App\Models\Client\LogEntry;
use App\Models\Client\Student;
use App\Models\Client\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<LogEntry>
 */
class LogEntryFactory extends Factory
{
    protected $model = LogEntry::class;

    /**
     * @var array<string, array<int, string>>
     */
    private static array $descriptions = [
        'logro' => [
            'Logro identificar las vocales de su nombre correctamente durante la actividad de lectoescritura.',
            'Participo activamente en la clase de educacion fisica, completando el circuito de psicomotricidad.',
            'Mejoro notablemente su capacidad de atencion durante la actividad grupal, manteniendo el enfoque por 15 minutos.',
            'Completo la actividad de clasificacion de colores sin apoyo del docente.',
            'Demostro avance en habilidades de comunicacion al solicitar materiales de forma verbal.',
            'Logro abrochar su mochila de forma independiente por primera vez.',
        ],
        'conducta' => [
            'Presento episodio de frustracion durante el cambio de actividad. Se aplico protocolo de contencion emocional.',
            'Mostro resistencia a la transicion del recreo al aula. Se utilizo temporizador visual como apoyo.',
            'Tuvo una excelente disposicion durante toda la jornada, cooperando con sus companeros.',
            'Se observo mejora en la autorregulacion emocional comparado con semanas anteriores.',
        ],
        'salud' => [
            'Se reporta cuadro de gripe leve. Se notifico a la familia para seguimiento en casa.',
            'Tomo su medicamento en el horario indicado sin dificultad.',
            'Se realizo cambio de aparato auditivo. La familia proporciono el nuevo equipo.',
            'Presento dolor de estomago despues del almuerzo. Se contacto al tutor.',
        ],
        'incidente' => [
            'Sufrio caida leve en el patio durante el recreo. Se aplicaron primeros auxilios y se notifico al tutor.',
            'Se detecto reaccion alergica menor en las manos. Se aplico protocolo y se contacto a la familia.',
        ],
    ];

    public function definition(): array
    {
        $categoria = fake()->randomElement(LogEntryCategory::cases());
        $descriptions = self::$descriptions[$categoria->value] ?? self::$descriptions['logro'];

        return [
            'student_id' => Student::factory(),
            'created_by' => User::factory(),
            'fecha_nota' => fake()->dateTimeBetween('-3 months', 'now'),
            'categoria' => $categoria,
            'descripcion' => fake()->randomElement($descriptions),
            'notificar_padres' => fake()->boolean(30),
        ];
    }
}
