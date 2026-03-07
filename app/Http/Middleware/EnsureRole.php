<?php

namespace App\Http\Middleware;

use App\Enums\SystemRole;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureRole
{
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->user();

        if (! $user || ! $user->rol_sistema instanceof SystemRole) {
            abort(403);
        }

        $effectiveRole = $user->effectiveRole();

        foreach ($roles as $role) {
            if ($effectiveRole->value === $role) {
                return $next($request);
            }
        }

        abort(403);
    }
}
