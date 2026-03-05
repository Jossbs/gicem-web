<?php

namespace App\Http\Controllers;

use App\Enums\AlcanceAnuncio;
use App\Enums\PrioridadAnuncio;
use App\Enums\TipoEmisor;
use App\Http\Requests\StoreAnuncioRequest;
use App\Models\Client\Anuncio;
use App\Models\Client\Group;
use App\Models\Client\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AnuncioController extends Controller
{
    public function index(Request $request): Response
    {
        $anuncios = Anuncio::query()
            ->with('emisor:id,name,apellido_paterno,apellido_materno')
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
        return Inertia::render('anuncios/create', [
            'tipoEmisorOptions' => $this->enumToOptions(TipoEmisor::cases()),
            'alcanceOptions' => $this->enumToOptions(AlcanceAnuncio::cases()),
            'prioridadOptions' => $this->enumToOptions(PrioridadAnuncio::cases()),
            'userOptions' => $this->getUserOptions(),
            'groupOptions' => $this->getGroupOptions(),
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

        Anuncio::create($data);

        return redirect()->route('anuncios.index')
            ->with('success', 'Anuncio enviado exitosamente.');
    }

    public function show(Anuncio $anuncio): Response
    {
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
        $anuncio->delete();

        return redirect()->route('anuncios.index')
            ->with('success', 'Anuncio eliminado exitosamente.');
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
