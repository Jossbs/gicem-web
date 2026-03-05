<?php

namespace App\Http\Controllers;

use App\Enums\SystemRole;
use App\Http\Requests\StoreStaffRequest;
use App\Http\Requests\UpdateStaffRequest;
use App\Models\Client\Group;
use App\Models\Client\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class StaffController extends Controller
{
    public function index(Request $request): Response
    {
        $staff = User::query()
            ->whereNot('rol_sistema', 'tutor')
            ->with('grupoAsignado:id,nombre_grupo')
            ->when($request->input('search'), function ($query, $search): void {
                $query->where(function ($q) use ($search): void {
                    $q->where('name', 'ilike', "%{$search}%")
                        ->orWhere('apellido_paterno', 'ilike', "%{$search}%")
                        ->orWhere('apellido_materno', 'ilike', "%{$search}%")
                        ->orWhere('email', 'ilike', "%{$search}%");
                });
            })
            ->when($request->input('rol'), function ($query, $rol): void {
                $query->where('rol_sistema', $rol);
            })
            ->orderBy('apellido_paterno')
            ->orderBy('apellido_materno')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('staff/index', [
            'staff' => $staff,
            'filters' => $request->only(['search', 'rol']),
            'roleOptions' => $this->getStaffRoleOptions(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('staff/create', [
            'roleOptions' => $this->getStaffRoleOptions(),
            'groupOptions' => $this->getGroupOptions(),
        ]);
    }

    public function store(StoreStaffRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $enviarInvitacion = $data['enviar_invitacion'] ?? false;
        unset($data['enviar_invitacion']);

        if ($request->hasFile('fotografia')) {
            $data['fotografia_url'] = $request->file('fotografia')->store('staff', 'public');
        }
        unset($data['fotografia']);

        if ($enviarInvitacion) {
            $data['password'] = Str::random(32);
        }

        $user = User::create($data);

        if ($enviarInvitacion) {
            $token = Password::broker()->createToken($user);
            $user->sendPasswordResetNotification($token);
        }

        $message = $enviarInvitacion
            ? 'Personal registrado. Se envió invitación por correo electrónico.'
            : 'Miembro del personal registrado exitosamente.';

        return redirect()->route('staff.index')
            ->with('success', $message);
    }

    public function show(User $staff): Response
    {
        $staff->load('grupoAsignado:id,nombre_grupo');
        $staff->append('fotografia_display_url');

        return Inertia::render('staff/show', [
            'member' => $staff,
        ]);
    }

    public function edit(User $staff): Response
    {
        $staff->append('fotografia_display_url');

        return Inertia::render('staff/edit', [
            'member' => $staff,
            'roleOptions' => $this->getStaffRoleOptions(),
            'groupOptions' => $this->getGroupOptions(),
        ]);
    }

    public function update(UpdateStaffRequest $request, User $staff): RedirectResponse
    {
        $data = $request->validated();

        if ($request->hasFile('fotografia')) {
            $data['fotografia_url'] = $request->file('fotografia')->store('staff', 'public');
        }
        unset($data['fotografia']);

        if (empty($data['password'])) {
            unset($data['password']);
        }

        $staff->update($data);

        return redirect()->route('staff.show', $staff)
            ->with('success', 'Personal actualizado exitosamente.');
    }

    public function sendInvitation(User $staff): RedirectResponse
    {
        $token = Password::broker()->createToken($staff);
        $staff->sendPasswordResetNotification($token);

        return redirect()->route('staff.show', $staff)
            ->with('success', 'Invitación enviada por correo electrónico.');
    }

    public function destroy(User $staff): RedirectResponse
    {
        $staff->delete();

        return redirect()->route('staff.index')
            ->with('success', 'Miembro del personal eliminado exitosamente.');
    }

    /**
     * @return array<int, array{value: string, label: string}>
     */
    private function getGroupOptions(): array
    {
        return Group::query()
            ->orderBy('nombre_grupo')
            ->get(['id', 'nombre_grupo'])
            ->map(fn (Group $group) => [
                'value' => (string) $group->id,
                'label' => $group->nombre_grupo,
            ])
            ->values()
            ->all();
    }

    /**
     * @return array<int, array{value: string, label: string}>
     */
    private function getStaffRoleOptions(): array
    {
        $staffRoles = array_filter(
            SystemRole::cases(),
            fn (SystemRole $role) => $role !== SystemRole::Tutor,
        );

        return array_values(array_map(fn ($case) => [
            'value' => $case->value,
            'label' => $case->label(),
        ], $staffRoles));
    }
}
