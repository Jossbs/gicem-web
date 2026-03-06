<?php

namespace App\Http\Middleware;

use App\Enums\SystemRole;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureRole
{
    /**
     * @param  string  ...$roles
     */
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->user();

        if (! $user || ! $user->rol_sistema instanceof SystemRole) {
            abort(403);
        }

        foreach ($roles as $role) {
            if ($user->rol_sistema->value === $role) {
                return $next($request);
            }
        }

        abort(403);
    }
}
