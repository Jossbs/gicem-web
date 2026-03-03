<?php

namespace App\Http\Controllers;

use App\Models\Client\Student;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class StudentController extends Controller
{
    public function index()
    {
        return Inertia::render('Students/Index', [
            'students' => Student::select('id', 'first_name', 'paternal_surname', 'enrollment_status')->paginate(10)
        ]);
    }

    public function create()
    {
        // Retornamos catálogos necesarios para los selects
        return Inertia::render('Students/Create', [
            'catalogs' => [
                'blood_types' => ['O+', 'A-', 'AB+', '...'],
                'disabilities' => ['Motriz', 'Visual', 'Auditiva', 'Intelectual', '...'],
                // Agrega aquí los demás catálogos del diccionario
            ]
        ]);
    }

    public function store(Request $request)
    {
        // Validación base (permitimos nullable si es borrador, required si es final)
        // Aquí simplifico asumiendo que guardan un registro completo por ahora.
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'paternal_surname' => 'required|string|max:255',
            'curp' => 'required|string|size:18|unique:client.students,curp',
            'birth_date' => 'required|date',
            'doc_acta_nacimiento' => 'nullable|file|mimes:pdf|max:2048', // Usamos nombres del form
            // ... resto de validaciones según "Obligatoriedad"
        ]);

        $student = new Student($validated);

        // Manejo de Archivos (Privacidad Total)
        $files = [
            'doc_acta_nacimiento' => 'birth_certificate_path',
            'curp_alumno' => 'curp_path',
            'doc_cert_discapacidad' => 'disability_certificate_path',
            // ... mapear el resto
        ];

        foreach ($files as $inputName => $dbColumn) {
            if ($request->hasFile($inputName)) {
                // Guardamos en disco privado 'students' (configurar en filesystems.php)
                $path = $request->file($inputName)->store('students_docs', 'local');
                $student->$dbColumn = $path;
            }
        }

        $student->save();

        return redirect()->route('students.index')->with('success', 'Expediente creado correctamente.');
    }
}
