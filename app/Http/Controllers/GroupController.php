<?php

namespace App\Http\Controllers;

use App\Enums\EducationLevel;
use App\Enums\GroupSpecialty;
use App\Enums\SchoolGrade;
use App\Enums\SchoolShift;
use App\Http\Requests\StoreGroupRequest;
use App\Http\Requests\UpdateGroupRequest;
use App\Models\Client\Group;
use App\Models\Client\Student;
use App\Models\Client\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class GroupController extends Controller
{
    public function index(Request $request): Response
    {
        Gate::authorize('groups.access');

        $user = $request->user();

        $groups = Group::query()
            ->with('docente:id,name,apellido_paterno,apellido_materno')
            ->when($user->isDocente(), fn ($q) => $q->where('docente_id', $user->id))
            ->when($request->input('search'), function ($query, $search): void {
                $query->where(function ($q) use ($search): void {
                    $q->where('nombre_grupo', 'ilike', "%{$search}%")
                        ->orWhere('aula_fisica', 'ilike', "%{$search}%")
                        ->orWhereHas('docente', function ($q) use ($search): void {
                            $q->where('name', 'ilike', "%{$search}%");
                        });
                });
            })
            ->when($request->input('nivel'), function ($query, $nivel): void {
                $query->where('nivel_educativo', $nivel);
            })
            ->when($request->input('turno'), function ($query, $turno): void {
                $query->where('turno', $turno);
            })
            ->orderBy('nombre_grupo')
            ->paginate(15)
            ->withQueryString();

        $groupNames = $groups->getCollection()->pluck('nombre_grupo')->all();
        $studentCounts = [];
        if (count($groupNames) > 0) {
            $studentCounts = Student::query()
                ->whereIn('grado_grupo', $groupNames)
                ->selectRaw('grado_grupo, count(*) as total')
                ->groupBy('grado_grupo')
                ->pluck('total', 'grado_grupo')
                ->all();
        }

        $groups->getCollection()->transform(function ($group) use ($studentCounts) {
            $group->students_count = $studentCounts[$group->nombre_grupo] ?? 0;

            return $group;
        });

        return Inertia::render('groups/index', [
            'groups' => $groups,
            'filters' => $request->only(['search', 'nivel', 'turno']),
            'levelOptions' => $this->enumToOptions(EducationLevel::cases()),
            'shiftOptions' => $this->enumToOptions(SchoolShift::cases()),
        ]);
    }

    public function create(): Response
    {
        Gate::authorize('groups.manage');

        return Inertia::render('groups/create', [
            'levelOptions' => $this->enumToOptions(EducationLevel::cases()),
            'gradeOptions' => $this->enumToOptions(SchoolGrade::cases()),
            'shiftOptions' => $this->enumToOptions(SchoolShift::cases()),
            'specialtyOptions' => $this->enumToOptions(GroupSpecialty::cases()),
            'docenteOptions' => $this->getDocenteOptions(),
        ]);
    }

    public function store(StoreGroupRequest $request): RedirectResponse
    {
        Gate::authorize('groups.manage');

        Group::create($request->validated());

        return redirect()->route('groups.index')
            ->with('success', 'Grupo escolar creado exitosamente.');
    }

    public function show(Group $group): Response
    {
        Gate::authorize('groups.access');

        $user = request()->user();
        if ($user->isDocente() && $group->docente_id !== $user->id) {
            abort(403);
        }

        $group->load('docente:id,name,apellido_paterno,apellido_materno');

        $students = Student::query()
            ->where('grado_grupo', $group->nombre_grupo)
            ->select(['id', 'nombre_completo', 'apellido_paterno', 'apellido_materno', 'discapacidad', 'estatus_alumno', 'grado_grupo'])
            ->orderBy('apellido_paterno')
            ->get();

        return Inertia::render('groups/show', [
            'group' => array_merge($group->toArray(), [
                'students' => $students,
                'students_count' => $students->count(),
            ]),
        ]);
    }

    public function edit(Group $group): Response
    {
        Gate::authorize('groups.manage');

        return Inertia::render('groups/edit', [
            'group' => $group,
            'levelOptions' => $this->enumToOptions(EducationLevel::cases()),
            'gradeOptions' => $this->enumToOptions(SchoolGrade::cases()),
            'shiftOptions' => $this->enumToOptions(SchoolShift::cases()),
            'specialtyOptions' => $this->enumToOptions(GroupSpecialty::cases()),
            'docenteOptions' => $this->getDocenteOptions(),
        ]);
    }

    public function update(UpdateGroupRequest $request, Group $group): RedirectResponse
    {
        Gate::authorize('groups.manage');

        $group->update($request->validated());

        return redirect()->route('groups.show', $group)
            ->with('success', 'Grupo actualizado exitosamente.');
    }

    public function destroy(Group $group): RedirectResponse
    {
        Gate::authorize('groups.manage');

        $group->delete();

        return redirect()->route('groups.index')
            ->with('success', 'Grupo eliminado exitosamente.');
    }

    /**
     * @return array<int, array{value: string, label: string}>
     */
    private function getDocenteOptions(): array
    {
        return User::query()
            ->orderBy('name')
            ->get(['id', 'name', 'apellido_paterno', 'apellido_materno'])
            ->map(fn (User $user) => [
                'value' => (string) $user->id,
                'label' => trim("{$user->name} {$user->apellido_paterno} {$user->apellido_materno}"),
            ])
            ->values()
            ->all();
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
