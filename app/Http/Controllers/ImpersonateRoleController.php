<?php

namespace App\Http\Controllers;

use App\Enums\SystemRole;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class ImpersonateRoleController extends Controller
{
    public function start(Request $request): RedirectResponse
    {
        $request->validate([
            'role' => ['required', 'string', Rule::in(array_column(SystemRole::cases(), 'value'))],
        ]);

        $user = $request->user();

        if (! $user->isRealAdmin()) {
            abort(403);
        }

        $role = $request->input('role');

        if ($role === SystemRole::Admin->value) {
            $request->session()->forget('impersonating_role');
        } else {
            $request->session()->put('impersonating_role', $role);
        }

        return redirect()->route('dashboard');
    }

    public function stop(Request $request): RedirectResponse
    {
        $request->session()->forget('impersonating_role');

        return redirect()->route('dashboard');
    }
}
