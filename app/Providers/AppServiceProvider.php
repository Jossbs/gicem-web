<?php

namespace App\Providers;

use App\Enums\Frontend\EmphasisVariant;
use App\Enums\Frontend\ResponseStyle;
use App\Models\Client\User;
use App\Services\PgsqlVerificationService;
use Carbon\CarbonImmutable;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    /**
     * @throws \Throwable
     */
    public function boot(): void
    {
        $this->declareMacros();
        $this->configureAuthorization();
        $this->configureNotifications();

        $this->configureDatabaseConnection();
        $this->configureDefaults();
    }

    public function declareMacros(): void
    {
        Inertia::macro('notify', function (string $message, ResponseStyle $style, EmphasisVariant $variant = EmphasisVariant::AFFIRMATIVE) {
            /** @phpstan-ignore method.notFound ($this is bound to Inertia\ResponseFactory at runtime) */
            return $this->flash($style->value, [
                'message' => $message,
                'variant' => $variant->value,
            ]);
        });
    }

    /**
     * @throws \Throwable
     */
    public function configureDatabaseConnection(): void
    {
        if ($this->app->runningUnitTests()) {
            PgsqlVerificationService::ensureDatabaseAndSchemaExist();
        }

        PgsqlVerificationService::verifyConnection();
    }

    protected function configureAuthorization(): void
    {
        Gate::define('students.create', fn (User $user): bool => $user->isAdmin() || $user->isTrabajadorSocial());

        Gate::define('students.edit', fn (User $user): bool => $user->isAdmin() || $user->isTrabajadorSocial());

        Gate::define('students.delete', fn (User $user): bool => $user->isAdmin() || $user->isTrabajadorSocial());

        Gate::define('groups.access', fn (User $user): bool => $user->isAdmin() || $user->isDocente());

        Gate::define('groups.manage', fn (User $user): bool => $user->isAdmin());

        Gate::define('staff.access', fn (User $user): bool => $user->isAdmin());

        Gate::define('guardians.edit', fn (User $user): bool => $user->isAdmin());

        Gate::define('guardians.create-account', fn (User $user): bool => $user->isAdmin() || $user->isTrabajadorSocial());

        Gate::define('anuncios.delete', fn (User $user): bool => $user->isAdmin() || $user->isTrabajadorSocial());
    }

    protected function configureNotifications(): void
    {
        ResetPassword::toMailUsing(function (User $notifiable, string $token): MailMessage {
            $url = url(route('password.reset', [
                'token' => $token,
                'email' => $notifiable->getEmailForPasswordReset(),
            ], false));

            return (new MailMessage)
                ->subject('GICEM — Invitación para acceder al sistema')
                ->greeting("¡Hola, {$notifiable->name}!")
                ->line('Has sido invitado a acceder al Sistema GICEM (Gestión Integral para Centros de Educación Múltiple).')
                ->line('Haz clic en el siguiente botón para establecer tu contraseña y activar tu cuenta:')
                ->action('Establecer mi contraseña', $url)
                ->line('Este enlace expirará en 60 minutos.')
                ->line('Si no esperabas esta invitación, puedes ignorar este correo.')
                ->salutation('Atentamente, Equipo GICEM');
        });
    }

    protected function configureDefaults(): void
    {
        Date::use(CarbonImmutable::class);

        DB::prohibitDestructiveCommands($this->app->isProduction());

        Model::shouldBeStrict(! $this->app->isProduction());

        Vite::useAggressivePrefetching();

        if ($this->app->isProduction()) {
            URL::forceScheme('https');
        }

        Password::defaults(fn (): ?Password => $this->app->isProduction()
            ? Password::min(12)
                ->mixedCase()
                ->letters()
                ->numbers()
                ->symbols()
                ->uncompromised()
            : null
        );
    }
}
