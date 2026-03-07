<?php

namespace App\Http\Controllers;

use App\Enums\AttendanceStatus;
use App\Models\Client\Attendance;
use App\Models\Client\Group;
use App\Models\Client\Student;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class AttendanceController extends Controller
{
    public function index(Request $request): Response
    {
        Gate::authorize('attendance.access');

        $user = $request->user();

        $groups = Group::query()
            ->with('docente:id,name,apellido_paterno,apellido_materno')
            ->when($user->isDocente(), fn ($q) => $q->where('docente_id', $user->id))
            ->orderBy('nombre_grupo')
            ->get();

        return Inertia::render('attendance/index', [
            'groups' => $groups,
        ]);
    }

    public function take(Request $request, Group $group): Response
    {
        Gate::authorize('attendance.take');

        $user = $request->user();
        if ($user->isDocente() && $group->docente_id !== $user->id) {
            abort(403);
        }

        $fecha = $request->input('fecha', now()->toDateString());

        $students = Student::query()
            ->where('grado_grupo', $group->nombre_grupo)
            ->where('status', 'completo')
            ->where('estatus_alumno', 'activo')
            ->select(['id', 'nombre_completo', 'apellido_paterno', 'apellido_materno', 'discapacidad'])
            ->orderBy('apellido_paterno')
            ->orderBy('apellido_materno')
            ->get();

        $existing = Attendance::query()
            ->whereIn('student_id', $students->pluck('id'))
            ->where('fecha', $fecha)
            ->get()
            ->keyBy('student_id');

        $studentsWithAttendance = $students->map(function (Student $student) use ($existing) {
            $attendance = $existing->get($student->id);

            return [
                'id' => $student->id,
                'nombre_completo' => $student->nombre_completo,
                'apellido_paterno' => $student->apellido_paterno,
                'apellido_materno' => $student->apellido_materno,
                'discapacidad' => $student->discapacidad?->value,
                'estatus' => $attendance?->estatus?->value ?? '',
                'observaciones' => $attendance?->observaciones ?? '',
            ];
        });

        $group->load('docente:id,name,apellido_paterno,apellido_materno');

        return Inertia::render('attendance/take', [
            'group' => $group,
            'students' => $studentsWithAttendance,
            'fecha' => $fecha,
            'statusOptions' => $this->enumToOptions(AttendanceStatus::cases()),
            'isExisting' => $existing->isNotEmpty(),
        ]);
    }

    public function store(Request $request, Group $group): RedirectResponse
    {
        Gate::authorize('attendance.take');

        $user = $request->user();
        if ($user->isDocente() && $group->docente_id !== $user->id) {
            abort(403);
        }

        $validated = $request->validate([
            'fecha' => ['required', 'date'],
            'records' => ['required', 'array', 'min:1'],
            'records.*.student_id' => ['required', 'integer', Rule::exists('client.students', 'id')],
            'records.*.estatus' => ['required', Rule::enum(AttendanceStatus::class)],
            'records.*.observaciones' => ['nullable', 'string', 'max:500'],
        ], [
            'fecha.required' => 'La fecha es obligatoria.',
            'records.required' => 'Debe registrar la asistencia de al menos un alumno.',
            'records.*.estatus.required' => 'Seleccione el estatus de asistencia para cada alumno.',
        ]);

        foreach ($validated['records'] as $record) {
            Attendance::updateOrCreate(
                [
                    'student_id' => $record['student_id'],
                    'fecha' => $validated['fecha'],
                ],
                [
                    'estatus' => $record['estatus'],
                    'observaciones' => $record['observaciones'] ?? null,
                    'recorded_by' => $user->id,
                ],
            );
        }

        return redirect()->route('attendance.show', [
            'group' => $group->id,
            'fecha' => $validated['fecha'],
        ])->with('success', 'Asistencia registrada exitosamente.');
    }

    public function show(Request $request, Group $group): Response
    {
        Gate::authorize('attendance.access');

        $user = $request->user();
        if ($user->isDocente() && $group->docente_id !== $user->id) {
            abort(403);
        }

        $fecha = $request->input('fecha', now()->toDateString());

        $group->load('docente:id,name,apellido_paterno,apellido_materno');

        $students = Student::query()
            ->where('grado_grupo', $group->nombre_grupo)
            ->where('status', 'completo')
            ->where('estatus_alumno', 'activo')
            ->select(['id', 'nombre_completo', 'apellido_paterno', 'apellido_materno', 'discapacidad'])
            ->orderBy('apellido_paterno')
            ->orderBy('apellido_materno')
            ->get();

        $attendances = Attendance::query()
            ->whereIn('student_id', $students->pluck('id'))
            ->where('fecha', $fecha)
            ->with('recordedBy:id,name')
            ->get()
            ->keyBy('student_id');

        $studentsWithAttendance = $students->map(function (Student $student) use ($attendances) {
            $attendance = $attendances->get($student->id);

            return [
                'id' => $student->id,
                'nombre_completo' => $student->nombre_completo,
                'apellido_paterno' => $student->apellido_paterno,
                'apellido_materno' => $student->apellido_materno,
                'discapacidad' => $student->discapacidad?->value,
                'estatus' => $attendance?->estatus?->value ?? null,
                'observaciones' => $attendance?->observaciones ?? null,
                'recorded_by' => $attendance?->recordedBy?->name ?? null,
            ];
        });

        $summary = [
            'presente' => $attendances->where('estatus', AttendanceStatus::Presente)->count(),
            'falta' => $attendances->where('estatus', AttendanceStatus::Falta)->count(),
            'retardo' => $attendances->where('estatus', AttendanceStatus::Retardo)->count(),
            'justificado' => $attendances->where('estatus', AttendanceStatus::Justificado)->count(),
            'sin_registro' => $students->count() - $attendances->count(),
            'total' => $students->count(),
        ];

        return Inertia::render('attendance/show', [
            'group' => $group,
            'students' => $studentsWithAttendance,
            'fecha' => $fecha,
            'summary' => $summary,
        ]);
    }

    /**
     * @param  array<\BackedEnum>  $cases
     * @return array<int, array{value: string, label: string}>
     */
    private function enumToOptions(array $cases): array
    {
        return array_map(fn ($case) => [
            'value' => $case->value,
            'label' => $case->label(),
        ], $cases);
    }
}
