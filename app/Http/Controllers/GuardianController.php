<?php

namespace App\Http\Controllers;

use App\Enums\Kinship;
use App\Enums\SystemRole;
use App\Models\Client\Student;
use App\Models\Client\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class GuardianController extends Controller
{
    public function index(Request $request): Response
    {
        $guardians = Student::query()
            ->with('tutorUser:id,email')
            ->select([
                'id',
                'tutor_nombre',
                'tutor_apellido_paterno',
                'tutor_apellido_materno',
                'tutor_parentesco',
                'tel_emergencia_1',
                'tel_emergencia_2',
                'correo_tutor',
                'domicilio_calle',
                'domicilio_numero',
                'domicilio_colonia',
                'domicilio_municipio',
                'domicilio_estado',
                'domicilio_cp',
                'nombre_completo',
                'apellido_paterno',
                'apellido_materno',
                'tutor_user_id',
            ])
            ->when($request->input('search'), function ($query, $search): void {
                $query->where(function ($q) use ($search): void {
                    $q->where('tutor_nombre', 'ilike', "%{$search}%")
                        ->orWhere('tutor_apellido_paterno', 'ilike', "%{$search}%")
                        ->orWhere('tutor_apellido_materno', 'ilike', "%{$search}%")
                        ->orWhere('correo_tutor', 'ilike', "%{$search}%")
                        ->orWhere('tel_emergencia_1', 'ilike', "%{$search}%");
                });
            })
            ->when($request->input('parentesco'), function ($query, $parentesco): void {
                $query->where('tutor_parentesco', $parentesco);
            })
            ->orderBy('tutor_apellido_paterno')
            ->orderBy('tutor_apellido_materno')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('guardians/index', [
            'guardians' => $guardians,
            'filters' => $request->only(['search', 'parentesco']),
            'kinshipOptions' => $this->enumToOptions(Kinship::cases()),
        ]);
    }

    public function show(Student $student): Response
    {
        $student->load('tutorUser:id,email');

        return Inertia::render('guardians/show', [
            'student' => [
                ...$student->only([
                    'id',
                    'tutor_nombre',
                    'tutor_apellido_paterno',
                    'tutor_apellido_materno',
                    'tutor_parentesco',
                    'tel_emergencia_1',
                    'tel_emergencia_2',
                    'correo_tutor',
                    'domicilio_calle',
                    'domicilio_numero',
                    'domicilio_colonia',
                    'domicilio_municipio',
                    'domicilio_estado',
                    'domicilio_cp',
                    'nombre_completo',
                    'apellido_paterno',
                    'apellido_materno',
                ]),
                'tutor_user_id' => $student->tutor_user_id,
                'tutor_user_email' => $student->tutorUser?->email,
            ],
        ]);
    }

    public function createAccount(Student $student): RedirectResponse
    {
        Gate::authorize('guardians.create-account');

        if ($student->tutor_user_id) {
            return redirect()->route('guardians.show', $student)
                ->with('info', 'Este tutor ya tiene una cuenta vinculada.');
        }

        $existingUser = User::where('email', $student->correo_tutor)->first();

        if ($existingUser) {
            $student->update(['tutor_user_id' => $existingUser->id]);

            return redirect()->route('guardians.show', $student)
                ->with('success', 'Se vinculó la cuenta existente al tutor.');
        }

        $user = User::create([
            'name' => $student->tutor_nombre,
            'apellido_paterno' => $student->tutor_apellido_paterno,
            'apellido_materno' => $student->tutor_apellido_materno,
            'email' => $student->correo_tutor,
            'password' => Str::random(32),
            'rol_sistema' => SystemRole::Tutor,
        ]);

        $student->update(['tutor_user_id' => $user->id]);

        $token = Password::broker()->createToken($user);
        $user->sendPasswordResetNotification($token);

        return redirect()->route('guardians.show', $student)
            ->with('success', 'Cuenta creada. Se envió invitación por correo electrónico.');
    }

    public function sendInvitation(Student $student): RedirectResponse
    {
        Gate::authorize('guardians.create-account');

        $user = $student->tutorUser;

        if (! $user) {
            return redirect()->route('guardians.show', $student)
                ->with('error', 'Este tutor no tiene una cuenta vinculada.');
        }

        $token = Password::broker()->createToken($user);
        $user->sendPasswordResetNotification($token);

        return redirect()->route('guardians.show', $student)
            ->with('success', 'Invitación enviada por correo electrónico.');
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
