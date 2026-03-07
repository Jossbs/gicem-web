<?php

namespace App\Http\Controllers;

use App\Enums\LogEntryCategory;
use App\Http\Requests\StoreLogEntryRequest;
use App\Models\Client\LogEntry;
use App\Models\Client\Student;
use App\Notifications\LogEntryNotification;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Notification;
use Inertia\Inertia;
use Inertia\Response;

class LogEntryController extends Controller
{
    public function index(Request $request, Student $student): Response
    {
        $user = $request->user();
        if ($user->isDocente()) {
            abort_unless(in_array($student->grado_grupo, $user->docenteGroupNames()), 403);
        }

        $student->append([
            'fotografia_display_url',
        ]);

        $logEntries = $student->logEntries()
            ->with('createdBy:id,name')
            ->when($request->input('categoria'), function ($query, $categoria): void {
                $query->where('categoria', $categoria);
            })
            ->orderByDesc('fecha_nota')
            ->orderByDesc('created_at')
            ->paginate(15)
            ->withQueryString();

        $logEntries->getCollection()->each(function (LogEntry $entry): void {
            $entry->append('evidencia_display_url');
        });

        return Inertia::render('students/log-entries/index', [
            'student' => $student,
            'logEntries' => $logEntries,
            'filters' => $request->only(['categoria']),
            'categoryOptions' => $this->enumToOptions(LogEntryCategory::cases()),
        ]);
    }

    public function create(Student $student): Response
    {
        Gate::authorize('log-entries.create');

        $student->append(['fotografia_display_url']);

        return Inertia::render('students/log-entries/create', [
            'student' => $student,
            'categoryOptions' => $this->enumToOptions(LogEntryCategory::cases()),
        ]);
    }

    public function store(StoreLogEntryRequest $request, Student $student): RedirectResponse
    {
        $data = $request->validated();

        if ($request->hasFile('evidencia')) {
            $data['evidencia_url'] = $request->file('evidencia')->store('log-entries/evidencias', 'public');
        }
        unset($data['evidencia']);

        $data['student_id'] = $student->id;
        $data['created_by'] = $request->user()->id;

        $logEntry = LogEntry::create($data);

        if ($logEntry->notificar_padres) {
            $this->notifyTutor($student, $logEntry, $request->user()->name);
        }

        return redirect()->route('students.log-entries.index', $student)
            ->with('success', 'Registro de bitácora guardado exitosamente.');
    }

    public function destroy(Student $student, LogEntry $logEntry): RedirectResponse
    {
        Gate::authorize('log-entries.delete');

        abort_unless($logEntry->student_id === $student->id, 404);

        $logEntry->delete();

        return redirect()->route('students.log-entries.index', $student)
            ->with('success', 'Registro eliminado exitosamente.');
    }

    private function notifyTutor(Student $student, LogEntry $logEntry, string $authorName): void
    {
        $studentName = trim("{$student->nombre_completo} {$student->apellido_paterno}");

        $tutor = $student->tutorUser;

        if ($tutor) {
            $tutor->notify(new LogEntryNotification($logEntry, $studentName, $authorName));

            return;
        }

        if ($student->correo_tutor) {
            $tutorName = trim("{$student->tutor_nombre} {$student->tutor_apellido_paterno}") ?: 'Tutor';

            Notification::route('mail', [
                $student->correo_tutor => $tutorName,
            ])->notify(new LogEntryNotification($logEntry, $studentName, $authorName));
        }
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
