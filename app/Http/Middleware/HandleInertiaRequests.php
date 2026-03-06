<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'auth' => [
                'user' => $request->user(),
                'can' => $request->user() ? [
                    'students.create' => Gate::allows('students.create'),
                    'students.edit' => Gate::allows('students.edit'),
                    'students.delete' => Gate::allows('students.delete'),
                    'groups.access' => Gate::allows('groups.access'),
                    'groups.manage' => Gate::allows('groups.manage'),
                    'staff.access' => Gate::allows('staff.access'),
                    'guardians.edit' => Gate::allows('guardians.edit'),
                    'guardians.create-account' => Gate::allows('guardians.create-account'),
                ] : [],
            ],
        ];
    }
}
