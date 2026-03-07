<?php

namespace App\Http\Controllers;

use App\Enums\AutonomySkill;
use App\Enums\BloodType;
use App\Enums\CommunicationType;
use App\Enums\DisabilityType;
use App\Enums\Gender;
use App\Enums\Kinship;
use App\Enums\LiteracyLevel;
use App\Enums\MedicalInstitution;
use App\Enums\StudentStatus;
use App\Http\Requests\StoreStudentRequest;
use App\Http\Requests\UpdateStudentRequest;
use App\Models\Client\Group;
use App\Models\Client\Student;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\Response as SymfonyResponse;

class StudentController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();
        $docenteGroupNames = $user->isDocente() ? $user->docenteGroupNames() : null;

        $drafts = Student::query()
            ->where('status', 'borrador')
            ->when($docenteGroupNames !== null, fn ($q) => $q->whereIn('grado_grupo', $docenteGroupNames))
            ->orderByDesc('updated_at')
            ->get();

        $students = Student::query()
            ->where('status', 'completo')
            ->when($docenteGroupNames !== null, fn ($q) => $q->whereIn('grado_grupo', $docenteGroupNames))
            ->when($request->input('search'), function ($query, $search): void {
                $query->where(function ($q) use ($search): void {
                    $q->where('nombre_completo', 'ilike', "%{$search}%")
                        ->orWhere('apellido_paterno', 'ilike', "%{$search}%")
                        ->orWhere('apellido_materno', 'ilike', "%{$search}%")
                        ->orWhere('curp', 'ilike', "%{$search}%");
                });
            })
            ->when($request->input('discapacidad'), function ($query, $discapacidad): void {
                $query->where('discapacidad', $discapacidad);
            })
            ->when($request->input('estatus'), function ($query, $estatus): void {
                $query->where('estatus_alumno', $estatus);
            })
            ->when($request->input('grupo'), function ($query, $grupo): void {
                $query->where('grado_grupo', $grupo);
            })
            ->orderBy('apellido_paterno')
            ->orderBy('apellido_materno')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('students/index', [
            'students' => $students,
            'drafts' => $drafts,
            'filters' => $request->only(['search', 'discapacidad', 'estatus', 'grupo']),
            'disabilityOptions' => $this->enumToOptions(DisabilityType::cases()),
            'statusOptions' => $this->enumToOptions(StudentStatus::cases()),
            'groupOptions' => Student::query()
                ->where('status', 'completo')
                ->whereNotNull('grado_grupo')
                ->when($docenteGroupNames !== null, fn ($q) => $q->whereIn('grado_grupo', $docenteGroupNames))
                ->distinct()
                ->pluck('grado_grupo')
                ->sort()
                ->values()
                ->all(),
        ]);
    }

    public function create(): Response
    {
        Gate::authorize('students.create');

        return Inertia::render('students/create', $this->formOptions());
    }

    public function store(Request $request): RedirectResponse
    {
        Gate::authorize('students.create');

        $action = $request->input('_action', 'finalize');

        if ($action === 'draft') {
            $data = $this->validateDraft($request);
            $data['status'] = 'borrador';
        } else {
            $formRequest = StoreStudentRequest::createFrom($request);
            $formRequest->setContainer(app());
            $validator = Validator::make(
                $request->all(),
                $formRequest->rules(),
                $formRequest->messages(),
            );
            $data = $validator->validate();
            $data['status'] = 'completo';
        }

        $data = $this->handleFileUploads($request, $data);
        unset($data['_action']);

        $student = Student::create($data);

        if ($action === 'draft') {
            return redirect()->route('students.index')
                ->with('success', 'Borrador guardado exitosamente.');
        }

        return redirect()->route('students.show', $student)
            ->with('success', 'Expediente de alumno creado exitosamente.');
    }

    public function show(Student $student): Response
    {
        $user = request()->user();
        if ($user->isDocente()) {
            abort_unless(in_array($student->grado_grupo, $user->docenteGroupNames()), 403);
        }

        $student->append($this->documentAppends());

        return Inertia::render('students/show', [
            'student' => $student,
        ]);
    }

    public function edit(Student $student): Response
    {
        Gate::authorize('students.edit');

        $student->append($this->documentAppends());

        return Inertia::render('students/edit', array_merge(
            ['student' => $student],
            $this->formOptions(),
        ));
    }

    public function update(Request $request, Student $student): RedirectResponse
    {
        Gate::authorize('students.edit');

        $action = $request->input('_action', 'finalize');

        if ($action === 'draft') {
            $data = $this->validateDraft($request);
            $data['status'] = 'borrador';
        } else {
            $formRequest = UpdateStudentRequest::createFrom($request);
            $formRequest->setContainer(app());
            $formRequest->setRouteResolver(fn () => $request->route());
            $validator = Validator::make(
                $request->all(),
                $formRequest->rules(),
                $formRequest->messages(),
            );
            $data = $validator->validate();
            $data['status'] = 'completo';
        }

        $data = $this->handleFileUploads($request, $data, $student);
        unset($data['_action']);

        $student->update($data);

        if ($action === 'draft') {
            return redirect()->route('students.index')
                ->with('success', 'Borrador actualizado exitosamente.');
        }

        return redirect()->route('students.show', $student)
            ->with('success', 'Expediente actualizado exitosamente.');
    }

    public function destroy(Student $student): RedirectResponse
    {
        Gate::authorize('students.delete');

        $student->delete();

        return redirect()->route('students.index')
            ->with('success', 'Expediente eliminado exitosamente.');
    }

    public function exportPdf(Student $student): SymfonyResponse
    {
        $user = request()->user();
        if ($user->isDocente()) {
            abort_unless(in_array($student->grado_grupo, $user->docenteGroupNames()), 403);
        }

        $photoBase64 = null;
        if ($student->fotografia_url) {
            $path = Storage::disk('public')->path($student->fotografia_url);
            if (file_exists($path)) {
                $mime = mime_content_type($path);
                $photoBase64 = 'data:'.$mime.';base64,'.base64_encode(file_get_contents($path));
            }
        }

        $documents = [
            ['label' => 'Acta de nacimiento', 'exists' => (bool) $student->doc_acta_nacimiento],
            ['label' => 'CURP (documento)', 'exists' => (bool) $student->curp_alumno_doc],
            ['label' => 'Cert. discapacidad', 'exists' => (bool) $student->doc_cert_discapacidad],
            ['label' => 'Documento NSS', 'exists' => (bool) $student->nss_original_doc],
            ['label' => 'Comp. domicilio', 'exists' => (bool) $student->comprobante_domicilio_doc],
            ['label' => 'INE del tutor', 'exists' => (bool) $student->ine_tutor_doc],
            ['label' => 'Fotografía', 'exists' => (bool) $student->fotografia_url],
        ];

        $filename = 'Expediente_'.str_replace(' ', '_', $student->apellido_paterno.'_'.$student->nombre_completo).'.pdf';

        $pdf = Pdf::loadView('pdf.student-record', [
            'student' => $student,
            'photoBase64' => $photoBase64,
            'documents' => $documents,
        ])->setPaper('letter');

        return $pdf->download($filename);
    }

    /**
     * @return array<string, mixed>
     */
    private function formOptions(): array
    {
        return [
            'genderOptions' => $this->enumToOptions(Gender::cases()),
            'bloodTypeOptions' => $this->enumToOptions(BloodType::cases()),
            'medicalInstitutionOptions' => $this->enumToOptions(MedicalInstitution::cases()),
            'disabilityOptions' => $this->enumToOptions(DisabilityType::cases()),
            'kinshipOptions' => $this->enumToOptions(Kinship::cases()),
            'communicationOptions' => $this->enumToOptions(CommunicationType::cases()),
            'literacyOptions' => $this->enumToOptions(LiteracyLevel::cases()),
            'autonomyOptions' => $this->enumToOptions(AutonomySkill::cases()),
            'statusOptions' => $this->enumToOptions(StudentStatus::cases()),
            'groupOptions' => Group::query()
                ->orderBy('nombre_grupo')
                ->get(['id', 'nombre_grupo'])
                ->map(fn (Group $g) => ['value' => $g->nombre_grupo, 'label' => $g->nombre_grupo])
                ->values()
                ->all(),
        ];
    }

    /**
     * @return array<int, string>
     */
    private function documentAppends(): array
    {
        return [
            'fotografia_display_url',
            'doc_acta_nacimiento_url',
            'curp_alumno_doc_url',
            'doc_cert_discapacidad_url',
            'nss_original_doc_url',
            'comprobante_domicilio_doc_url',
            'ine_tutor_doc_url',
        ];
    }

    /**
     * Validate draft with minimal rules (only type checks, no required).
     *
     * @return array<string, mixed>
     */
    private function validateDraft(Request $request): array
    {
        return $request->validate([
            'curp' => ['nullable', 'string', 'max:18'],
            'nombre_completo' => ['nullable', 'string', 'max:255'],
            'apellido_paterno' => ['nullable', 'string', 'max:255'],
            'apellido_materno' => ['nullable', 'string', 'max:255'],
            'fecha_nacimiento' => ['nullable', 'date'],
            'nacionalidad' => ['nullable', 'string', 'max:100'],
            'entidad_federativa' => ['nullable', 'string', 'max:100'],
            'genero' => ['nullable', 'string'],
            'nss' => ['nullable', 'string', 'max:20'],
            'institucion_medica' => ['nullable', 'string'],
            'tipo_sangre' => ['nullable', 'string'],
            'discapacidad' => ['nullable', 'string'],
            'diagnostico_medico' => ['nullable', 'string', 'max:2000'],
            'comorbilidades' => ['nullable', 'string', 'max:2000'],
            'alergias_graves' => ['nullable', 'string', 'max:1000'],
            'uso_aparatos' => ['nullable', 'string', 'max:500'],
            'medicacion_nombre' => ['nullable', 'string', 'max:255'],
            'medicacion_dosis' => ['nullable', 'string', 'max:255'],
            'medicacion_horario' => ['nullable', 'string', 'max:255'],
            'alerta_medica' => ['nullable', 'string', 'max:2000'],
            'tutor_nombre' => ['nullable', 'string', 'max:255'],
            'tutor_apellido_paterno' => ['nullable', 'string', 'max:255'],
            'tutor_apellido_materno' => ['nullable', 'string', 'max:255'],
            'tutor_parentesco' => ['nullable', 'string'],
            'tel_emergencia_1' => ['nullable', 'string', 'max:15'],
            'tel_emergencia_2' => ['nullable', 'string', 'max:15'],
            'correo_tutor' => ['nullable', 'email', 'max:255'],
            'domicilio_calle' => ['nullable', 'string', 'max:255'],
            'domicilio_numero' => ['nullable', 'string', 'max:20'],
            'domicilio_colonia' => ['nullable', 'string', 'max:255'],
            'domicilio_municipio' => ['nullable', 'string', 'max:255'],
            'domicilio_estado' => ['nullable', 'string', 'max:100'],
            'domicilio_cp' => ['nullable', 'string', 'max:5'],
            'comunicacion_tipo' => ['nullable', 'string'],
            'nivel_lectoescritura' => ['nullable', 'string'],
            'habilidades_autonomia' => ['nullable', 'array'],
            'habilidades_autonomia.*' => ['nullable', 'string'],
            'intereses_alumnos' => ['nullable', 'string', 'max:2000'],
            'detonantes_conducta' => ['nullable', 'string', 'max:2000'],
            'estatus_alumno' => ['nullable', 'string'],
            'grado_grupo' => ['nullable', 'string', 'max:20'],
            'fecha_ingreso' => ['nullable', 'date'],
            'fotografia' => ['nullable', 'image', 'max:5120'],
            'doc_acta_nacimiento' => ['nullable', 'file', 'mimes:pdf', 'max:5120'],
            'curp_alumno_doc' => ['nullable', 'file', 'mimes:pdf', 'max:5120'],
            'doc_cert_discapacidad' => ['nullable', 'file', 'mimes:pdf', 'max:5120'],
            'nss_original_doc' => ['nullable', 'file', 'mimes:pdf', 'max:5120'],
            'comprobante_domicilio_doc' => ['nullable', 'file', 'mimes:pdf', 'max:5120'],
            'ine_tutor_doc' => ['nullable', 'file', 'mimes:pdf', 'max:5120'],
        ]);
    }

    /**
     * Handle file uploads and return updated data array.
     *
     * @param  array<string, mixed>  $data
     * @return array<string, mixed>
     */
    private function handleFileUploads(Request $request, array $data, ?Student $student = null): array
    {
        $fileFields = [
            'fotografia' => 'fotografia_url',
            'doc_acta_nacimiento' => 'doc_acta_nacimiento',
            'curp_alumno_doc' => 'curp_alumno_doc',
            'doc_cert_discapacidad' => 'doc_cert_discapacidad',
            'nss_original_doc' => 'nss_original_doc',
            'comprobante_domicilio_doc' => 'comprobante_domicilio_doc',
            'ine_tutor_doc' => 'ine_tutor_doc',
        ];

        foreach ($fileFields as $inputName => $columnName) {
            unset($data[$inputName]);

            if ($request->hasFile($inputName)) {
                $path = $request->file($inputName)->store("students/{$inputName}", 'public');
                $data[$columnName] = $path;
            }
        }

        return $data;
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
