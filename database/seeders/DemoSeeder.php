<?php

namespace Database\Seeders;

use App\Enums\AlcanceAnuncio;
use App\Enums\AttendanceStatus;
use App\Enums\EducationLevel;
use App\Enums\GroupSpecialty;
use App\Enums\LogEntryCategory;
use App\Enums\PrioridadAnuncio;
use App\Enums\SchoolGrade;
use App\Enums\SchoolShift;
use App\Enums\SystemRole;
use App\Enums\TipoEmisor;
use App\Models\Client\Anuncio;
use App\Models\Client\Attendance;
use App\Models\Client\Group;
use App\Models\Client\LogEntry;
use App\Models\Client\Student;
use App\Models\Client\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DemoSeeder extends Seeder
{
    public function run(): void
    {
        $password = Hash::make('password');

        // ──────────────────────────────────────────────────
        // 1. USUARIOS — Cuentas con roles definidos
        // ──────────────────────────────────────────────────

        $admin = User::factory()->create([
            'name' => 'Carolina',
            'apellido_paterno' => 'Mendoza',
            'apellido_materno' => 'Rivera',
            'email' => 'admin@gicem.test',
            'password' => $password,
            'rol_sistema' => SystemRole::Admin,
        ]);

        $trabajadoraSocial = User::factory()->create([
            'name' => 'Patricia',
            'apellido_paterno' => 'Soto',
            'apellido_materno' => 'Duarte',
            'email' => 'tsocial@gicem.test',
            'password' => $password,
            'rol_sistema' => SystemRole::TrabajadorSocial,
        ]);

        $docentes = collect();

        $docenteData = [
            ['name' => 'Roberto', 'apellido_paterno' => 'Garcia', 'apellido_materno' => 'Lopez', 'email' => 'docente1@gicem.test'],
            ['name' => 'Maria Elena', 'apellido_paterno' => 'Torres', 'apellido_materno' => 'Hernandez', 'email' => 'docente2@gicem.test'],
            ['name' => 'Alejandro', 'apellido_paterno' => 'Ramirez', 'apellido_materno' => 'Castillo', 'email' => 'docente3@gicem.test'],
            ['name' => 'Laura', 'apellido_paterno' => 'Fernandez', 'apellido_materno' => 'Morales', 'email' => 'docente4@gicem.test'],
            ['name' => 'Jorge', 'apellido_paterno' => 'Navarro', 'apellido_materno' => 'Cruz', 'email' => 'docente5@gicem.test'],
        ];

        foreach ($docenteData as $data) {
            $docentes->push(User::factory()->create([
                ...$data,
                'password' => $password,
                'rol_sistema' => SystemRole::Docente,
            ]));
        }

        // ──────────────────────────────────────────────────
        // 2. GRUPOS ESCOLARES — Estructura realista del CAM
        // ──────────────────────────────────────────────────

        $groupDefinitions = [
            ['nombre' => 'Maternal-A', 'nivel' => EducationLevel::Maternal, 'grado' => SchoolGrade::Unico, 'docente' => 0, 'aula' => 'Aula 1', 'cap' => 8, 'esp' => [GroupSpecialty::Intelectual->value, GroupSpecialty::Multiple->value]],
            ['nombre' => 'Preescolar-1A', 'nivel' => EducationLevel::Preescolar, 'grado' => SchoolGrade::Primero, 'docente' => 1, 'aula' => 'Aula 2', 'cap' => 10, 'esp' => [GroupSpecialty::Intelectual->value]],
            ['nombre' => 'Preescolar-2A', 'nivel' => EducationLevel::Preescolar, 'grado' => SchoolGrade::Segundo, 'docente' => 1, 'aula' => 'Aula 3', 'cap' => 10, 'esp' => [GroupSpecialty::Intelectual->value, GroupSpecialty::TeaAutismo->value]],
            ['nombre' => '1-A', 'nivel' => EducationLevel::Primaria, 'grado' => SchoolGrade::Primero, 'docente' => 2, 'aula' => 'Aula 4', 'cap' => 12, 'esp' => [GroupSpecialty::Intelectual->value]],
            ['nombre' => '2-A', 'nivel' => EducationLevel::Primaria, 'grado' => SchoolGrade::Segundo, 'docente' => 2, 'aula' => 'Aula 5', 'cap' => 12, 'esp' => [GroupSpecialty::Intelectual->value, GroupSpecialty::Motriz->value]],
            ['nombre' => '3-A', 'nivel' => EducationLevel::Primaria, 'grado' => SchoolGrade::Tercero, 'docente' => 3, 'aula' => 'Aula 6', 'cap' => 12, 'esp' => [GroupSpecialty::Auditiva->value, GroupSpecialty::Visual->value]],
            ['nombre' => 'Sec-1A', 'nivel' => EducationLevel::Secundaria, 'grado' => SchoolGrade::Primero, 'docente' => 3, 'aula' => 'Aula 7', 'cap' => 15, 'esp' => [GroupSpecialty::Intelectual->value]],
            ['nombre' => 'Laboral-1', 'nivel' => EducationLevel::Laboral, 'grado' => SchoolGrade::Unico, 'docente' => 4, 'aula' => 'Taller 1', 'cap' => 15, 'esp' => [GroupSpecialty::Intelectual->value, GroupSpecialty::Psicosocial->value]],
        ];

        $groups = collect();
        foreach ($groupDefinitions as $def) {
            $groups->push(Group::create([
                'nombre_grupo' => $def['nombre'],
                'docente_id' => $docentes[$def['docente']]->id,
                'nivel_educativo' => $def['nivel'],
                'grado' => $def['grado'],
                'turno' => SchoolShift::Matutino,
                'especialidad_grupo' => $def['esp'],
                'aula_fisica' => $def['aula'],
                'capacidad_maxima' => $def['cap'],
                'ciclo_escolar' => '2025-2026',
            ]));
        }

        // Asignar grupo_asignado_id a cada docente (primer grupo que les toca)
        $docentes[0]->update(['grupo_asignado_id' => $groups[0]->id]);
        $docentes[1]->update(['grupo_asignado_id' => $groups[1]->id]);
        $docentes[2]->update(['grupo_asignado_id' => $groups[3]->id]);
        $docentes[3]->update(['grupo_asignado_id' => $groups[5]->id]);
        $docentes[4]->update(['grupo_asignado_id' => $groups[7]->id]);

        // ──────────────────────────────────────────────────
        // 3. ALUMNOS — Distribuidos en los grupos
        // ──────────────────────────────────────────────────

        $groupNames = $groups->pluck('nombre_grupo')->all();
        $tutorUsers = collect();

        $students = collect();
        foreach ($groupNames as $groupName) {
            $count = fake()->numberBetween(4, 7);
            for ($i = 0; $i < $count; $i++) {
                $student = Student::factory()->create([
                    'grado_grupo' => $groupName,
                    'estatus_alumno' => 'activo',
                    'status' => 'completo',
                ]);
                $students->push($student);

                // 60% de los alumnos tienen tutor con cuenta
                if (fake()->boolean(60)) {
                    $tutorUser = User::factory()->create([
                        'name' => $student->tutor_nombre,
                        'apellido_paterno' => $student->tutor_apellido_paterno,
                        'apellido_materno' => $student->tutor_apellido_materno,
                        'email' => $student->correo_tutor,
                        'password' => $password,
                        'rol_sistema' => SystemRole::Tutor,
                    ]);
                    $student->update(['tutor_user_id' => $tutorUser->id]);
                    $tutorUsers->push($tutorUser);
                }
            }
        }

        // Agregar algunos alumnos dados de baja o egresados
        Student::factory()->count(2)->create([
            'grado_grupo' => '1-A',
            'estatus_alumno' => 'baja_temporal',
            'status' => 'completo',
        ]);

        Student::factory()->count(2)->create([
            'grado_grupo' => 'Laboral-1',
            'estatus_alumno' => 'egresado',
            'status' => 'completo',
        ]);

        // ──────────────────────────────────────────────────
        // 4. ASISTENCIA — Ultimas 4 semanas de datos
        // ──────────────────────────────────────────────────

        $activeStudents = $students->all();
        $startDate = Carbon::now()->subWeeks(4)->startOfWeek();
        $endDate = Carbon::now();

        $allStaff = $docentes->merge([$admin, $trabajadoraSocial]);

        for ($date = $startDate->copy(); $date->lte($endDate); $date->addDay()) {
            if ($date->isWeekend()) {
                continue;
            }

            // Seleccionar ~80% de alumnos para asistencia cada dia
            $todayStudents = fake()->randomElements(
                $activeStudents,
                (int) ceil(count($activeStudents) * 0.8),
            );

            foreach ($todayStudents as $student) {
                $groupName = $student->grado_grupo;
                $group = $groups->firstWhere('nombre_grupo', $groupName);
                $recorder = $group ? $docentes->firstWhere('id', $group->docente_id) : $docentes->random();

                Attendance::create([
                    'student_id' => $student->id,
                    'recorded_by' => $recorder?->id ?? $admin->id,
                    'fecha' => $date->toDateString(),
                    'estatus' => fake()->randomElement([
                        AttendanceStatus::Presente,
                        AttendanceStatus::Presente,
                        AttendanceStatus::Presente,
                        AttendanceStatus::Presente,
                        AttendanceStatus::Presente,
                        AttendanceStatus::Presente,
                        AttendanceStatus::Falta,
                        AttendanceStatus::Retardo,
                        AttendanceStatus::Justificado,
                    ]),
                    'observaciones' => fake()->optional(0.05)->randomElement([
                        'Llego 10 minutos tarde por trafico.',
                        'Ausencia justificada por cita medica.',
                        'El tutor aviso por telefono.',
                        'Se retiro temprano por motivos de salud.',
                    ]),
                ]);
            }
        }

        // ──────────────────────────────────────────────────
        // 5. BITACORA DE NOTAS — Entradas variadas
        // ──────────────────────────────────────────────────

        $logStudents = $students->random(min(25, $students->count()));

        foreach ($logStudents as $student) {
            $entriesCount = fake()->numberBetween(1, 4);
            $groupName = $student->grado_grupo;
            $group = $groups->firstWhere('nombre_grupo', $groupName);
            $creator = $group ? $docentes->firstWhere('id', $group->docente_id) : $allStaff->random();

            LogEntry::factory()->count($entriesCount)->create([
                'student_id' => $student->id,
                'created_by' => $creator?->id ?? $admin->id,
            ]);
        }

        // Notas creadas por la trabajadora social
        $tsStudents = $students->random(min(8, $students->count()));
        foreach ($tsStudents as $student) {
            LogEntry::factory()->create([
                'student_id' => $student->id,
                'created_by' => $trabajadoraSocial->id,
                'categoria' => fake()->randomElement([LogEntryCategory::Salud, LogEntryCategory::Conducta]),
            ]);
        }

        // ──────────────────────────────────────────────────
        // 6. ANUNCIOS — Comunicados variados
        // ──────────────────────────────────────────────────

        $anuncioData = [
            [
                'user_id' => $admin->id,
                'tipo_emisor' => TipoEmisor::Admin,
                'alcance' => AlcanceAnuncio::Escuela,
                'asunto' => 'Suspension de clases por jornada de capacitacion',
                'mensaje' => "Estimada comunidad GICEM,\n\nSe les informa que el proximo viernes 14 de marzo se suspenderan clases debido a la Jornada de Capacitacion Docente programada por la SEP.\n\nLas actividades se reanudan con normalidad el lunes 17 de marzo.\n\nAgradecemos su comprension.",
                'prioridad' => PrioridadAnuncio::Urgente,
                'fecha_envio' => now()->subDays(5),
            ],
            [
                'user_id' => $admin->id,
                'tipo_emisor' => TipoEmisor::Admin,
                'alcance' => AlcanceAnuncio::Escuela,
                'asunto' => 'Convocatoria a reunion de padres de familia — Marzo 2026',
                'mensaje' => "Estimados tutores,\n\nSe les convoca a la reunion bimestral de padres de familia que se llevara a cabo el jueves 20 de marzo a las 9:00 AM en el auditorio del plantel.\n\nTemas a tratar:\n- Avances academicos del segundo bimestre\n- Actividades del Dia del Nino\n- Informe de la cooperativa escolar\n\nSu asistencia es importante para el seguimiento educativo de sus hijos.",
                'prioridad' => PrioridadAnuncio::Normal,
                'fecha_envio' => now()->subDays(3),
            ],
            [
                'user_id' => $trabajadoraSocial->id,
                'tipo_emisor' => TipoEmisor::Admin,
                'alcance' => AlcanceAnuncio::Escuela,
                'asunto' => 'Campana de vacunacion — Secretaria de Salud',
                'mensaje' => "Se informa que la proxima semana se llevara a cabo una jornada de vacunacion en coordinacion con la Secretaria de Salud del Estado.\n\nSe aplicaran las siguientes vacunas:\n- Influenza estacional\n- Refuerzo de triple viral (para quienes aplique)\n\nFavor de entregar la cartilla de vacunacion de su hijo(a) al docente titular antes del miercoles.\n\nPara cualquier duda, comunicarse con Trabajo Social.",
                'prioridad' => PrioridadAnuncio::Normal,
                'fecha_envio' => now()->subDays(2),
            ],
            [
                'user_id' => $docentes[0]->id,
                'tipo_emisor' => TipoEmisor::Docente,
                'alcance' => AlcanceAnuncio::Grupo,
                'asunto' => 'Materiales para actividad especial — Grupo Maternal-A',
                'mensaje' => "Estimados tutores del grupo Maternal-A,\n\nPara la actividad sensorial de la proxima semana necesitamos los siguientes materiales:\n- 1 bolsa de arroz crudo\n- 2 esponjas de diferentes texturas\n- 1 recipiente de plastico pequeno\n\nAgradezco su apoyo. Los materiales se necesitan para el lunes.",
                'prioridad' => PrioridadAnuncio::Normal,
                'fecha_envio' => now()->subDay(),
            ],
            [
                'user_id' => $admin->id,
                'tipo_emisor' => TipoEmisor::Admin,
                'alcance' => AlcanceAnuncio::Escuela,
                'asunto' => 'Nuevo modulo de asistencia digital activo',
                'mensaje' => "Companeros docentes,\n\nA partir de hoy se encuentra activo el modulo de Asistencia Digital en el sistema GICEM. Les pedimos registrar la asistencia diaria de sus grupos a traves de la plataforma.\n\nSi tienen alguna duda sobre el uso del sistema, el equipo de administracion estara disponible para apoyarles.\n\nGracias por su colaboracion.",
                'prioridad' => PrioridadAnuncio::Normal,
                'fecha_envio' => now(),
            ],
        ];

        foreach ($anuncioData as $data) {
            Anuncio::create($data);
        }

        // Anuncios adicionales generados por factory
        Anuncio::factory()->count(5)->create([
            'user_id' => fake()->randomElement([$admin->id, $trabajadoraSocial->id, $docentes[1]->id]),
            'tipo_emisor' => TipoEmisor::Admin,
            'alcance' => AlcanceAnuncio::Escuela,
        ]);

        // ──────────────────────────────────────────────────
        // Resumen de datos creados
        // ──────────────────────────────────────────────────

        $this->command->info('');
        $this->command->info('=== DATOS DE DEMOSTRACION CREADOS ===');
        $this->command->info('');
        $this->command->table(
            ['Recurso', 'Cantidad'],
            [
                ['Administrador', '1 (admin@gicem.test)'],
                ['Trabajadora Social', '1 (tsocial@gicem.test)'],
                ['Docentes', $docentes->count().' (docente1-5@gicem.test)'],
                ['Tutores con cuenta', $tutorUsers->count()],
                ['Grupos escolares', $groups->count()],
                ['Alumnos activos', $students->count()],
                ['Alumnos baja/egresados', '4'],
                ['Registros de asistencia', Attendance::count()],
                ['Notas de bitacora', LogEntry::count()],
                ['Anuncios', Anuncio::count()],
            ],
        );
        $this->command->info('');
        $this->command->info('Contrasena para todas las cuentas: password');
        $this->command->info('');
    }
}
