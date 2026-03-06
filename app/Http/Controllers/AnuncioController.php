<?php

namespace App\Http\Controllers;

use App\Enums\AlcanceAnuncio;
use App\Enums\PrioridadAnuncio;
use App\Enums\TipoEmisor;
use App\Http\Requests\StoreAnuncioRequest;
use App\Models\Client\Anuncio;
use App\Models\Client\Group;
use App\Models\Client\Student;
use App\Models\Client\User;
use App\Notifications\AnuncioNotification;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Notification;
use Inertia\Inertia;
use Inertia\Response;

class AnuncioController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();

        $anuncios = Anuncio::query()
            ->with('emisor:id,name,apellido_paterno,apellido_materno')
            ->when($user->isDocente(), function ($query) use ($user): void {
                $query->where(function ($q) use ($user): void {
                    $q->where('user_id', $user->id)
                        ->orWhere(fn ($q2) => $q2->where('destinatario_tipo', 'user')->where('destinatario_id', $user->id))
                        ->orWhere('alcance', 'escuela');
                });
            })
            ->when($request->input('search'), function ($query, $search): void {
                $query->where('asunto', 'ilike', "%{$search}%");
            })
            ->when($request->input('alcance'), function ($query, $alcance): void {
                $query->where('alcance', $alcance);
            })
            ->when($request->input('prioridad'), function ($query, $prioridad): void {
                $query->where('prioridad', $prioridad);
            })
            ->orderByDesc('fecha_envio')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('anuncios/index', [
            'anuncios' => $anuncios,
            'filters' => $request->only(['search', 'alcance', 'prioridad']),
            'alcanceOptions' => $this->enumToOptions(AlcanceAnuncio::cases()),
            'prioridadOptions' => $this->enumToOptions(PrioridadAnuncio::cases()),
        ]);
    }

    public function create(): Response
    {
        $user = request()->user();

        if ($user->isDocente()) {
            $docenteGroupIds = Group::where('docente_id', $user->id)->pluck('id')->all();
            $docenteGroupNames = Group::where('docente_id', $user->id)->pluck('nombre_grupo')->all();

            $tutorUserIds = Student::whereIn('grado_grupo', $docenteGroupNames)
                ->whereNotNull('tutor_user_id')
                ->pluck('tutor_user_id')
                ->unique()
                ->all();

            $alcanceOptions = $this->enumToOptions([AlcanceAnuncio::Grupo, AlcanceAnuncio::Privado]);
            $userOptions = User::whereIn('id', $tutorUserIds)
                ->orderBy('apellido_paterno')
                ->get(['id', 'name', 'apellido_paterno', 'apellido_materno'])
                ->map(fn (User $u) => [
                    'value' => (string) $u->id,
                    'label' => trim($u->name.' '.$u->apellido_paterno.' '.$u->apellido_materno),
                ])
                ->values()
                ->all();
            $groupOptions = Group::whereIn('id', $docenteGroupIds)
                ->orderBy('nombre_grupo')
                ->get(['id', 'nombre_grupo'])
                ->map(fn (Group $g) => [
                    'value' => (string) $g->id,
                    'label' => $g->nombre_grupo,
                ])
                ->values()
                ->all();
        } else {
            $alcanceOptions = $this->enumToOptions(AlcanceAnuncio::cases());
            $userOptions = $this->getUserOptions();
            $groupOptions = $this->getGroupOptions();
        }

        return Inertia::render('anuncios/create', [
            'tipoEmisorOptions' => $this->enumToOptions(TipoEmisor::cases()),
            'alcanceOptions' => $alcanceOptions,
            'prioridadOptions' => $this->enumToOptions(PrioridadAnuncio::cases()),
            'userOptions' => $userOptions,
            'groupOptions' => $groupOptions,
        ]);
    }

    public function store(StoreAnuncioRequest $request): RedirectResponse
    {
        $data = $request->validated();

        if ($request->hasFile('adjunto')) {
            $data['adjunto_url'] = $request->file('adjunto')->store('anuncios', 'public');
        }
        unset($data['adjunto']);

        $data['user_id'] = $request->user()->id;
        $data['fecha_envio'] = now();

        $alcance = $data['alcance'];
        if ($alcance === 'grupo') {
            $data['destinatario_tipo'] = 'group';
        } elseif ($alcance === 'privado') {
            $data['destinatario_tipo'] = 'user';
        } else {
            $data['destinatario_tipo'] = null;
            $data['destinatario_id'] = null;
        }

        $anuncio = Anuncio::create($data);

        $this->notifyRecipients($anuncio, $request->user());

        return redirect()->route('anuncios.index')
            ->with('success', 'Anuncio enviado exitosamente.');
    }

    public function show(Anuncio $anuncio): Response
    {
        $user = request()->user();
        if ($user->isDocente()) {
            abort_unless(
                $anuncio->user_id === $user->id
                || ($anuncio->destinatario_tipo === 'user' && $anuncio->destinatario_id === $user->id)
                || $anuncio->alcance === 'escuela',
                403,
            );
        }

        $anuncio->load('emisor:id,name,apellido_paterno,apellido_materno,rol_sistema');

        $destinatarioNombre = null;
        if ($anuncio->destinatario_tipo === 'user' && $anuncio->destinatario_id) {
            $user = User::find($anuncio->destinatario_id);
            $destinatarioNombre = $user
                ? trim($user->name.' '.$user->apellido_paterno.' '.$user->apellido_materno)
                : null;
        } elseif ($anuncio->destinatario_tipo === 'group' && $anuncio->destinatario_id) {
            $group = Group::find($anuncio->destinatario_id);
            $destinatarioNombre = $group?->nombre_grupo;
        }

        return Inertia::render('anuncios/show', [
            'anuncio' => $anuncio,
            'destinatarioNombre' => $destinatarioNombre,
        ]);
    }

    public function destroy(Anuncio $anuncio): RedirectResponse
    {
        $user = request()->user();

        if ($user->isDocente()) {
            abort_unless($anuncio->user_id === $user->id, 403);
        } elseif (! Gate::allows('anuncios.delete')) {
            abort(403);
        }

        $anuncio->delete();

        return redirect()->route('anuncios.index')
            ->with('success', 'Anuncio eliminado exitosamente.');
    }

    private function notifyRecipients(Anuncio $anuncio, User $sender): void
    {
        $emisorNombre = trim($sender->name.' '.$sender->apellido_paterno.' '.$sender->apellido_materno);

        $recipients = match ($anuncio->alcance) {
            \App\Enums\AlcanceAnuncio::Escuela => User::whereNotNull('email')->where('id', '!=', $sender->id)->get(),
            \App\Enums\AlcanceAnuncio::Grupo => User::where('grupo_asignado_id', $anuncio->destinatario_id)
                ->where('id', '!=', $sender->id)
                ->whereNotNull('email')
                ->get(),
            \App\Enums\AlcanceAnuncio::Privado => User::where('id', $anuncio->destinatario_id)->get(),
        };

        if ($recipients->isNotEmpty()) {
            Notification::send($recipients, new AnuncioNotification($anuncio, $emisorNombre));
        }
    }

    /**
     * @return array<int, array{value: string, label: string}>
     */
    private function getUserOptions(): array
    {
        return User::query()
            ->orderBy('apellido_paterno')
            ->orderBy('name')
            ->get(['id', 'name', 'apellido_paterno', 'apellido_materno'])
            ->map(fn (User $user) => [
                'value' => (string) $user->id,
                'label' => trim($user->name.' '.$user->apellido_paterno.' '.$user->apellido_materno),
            ])
            ->values()
            ->all();
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
    private function enumToOptions(array $cases): array
    {
        return array_map(fn ($case) => [
            'value' => $case->value,
            'label' => $case->label(),
        ], $cases);
    }
}
