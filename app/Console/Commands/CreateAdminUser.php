<?php

namespace App\Console\Commands;

use App\Models\Client\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

use function Laravel\Prompts\password;
use function Laravel\Prompts\text;

class CreateAdminUser extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:create-admin-user';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Crear un usuario administrador';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $name = text(
            label: 'Nombre completo',
            required: true,
        );

        $email = text(
            label: 'Correo electrónico',
            required: true,
            validate: function (string $value): ?string {
                $validator = Validator::make(
                    ['email' => $value],
                    ['email' => ['required', 'email', 'unique:App\Models\Client\User,email']],
                );

                if ($validator->fails()) {
                    return $validator->errors()->first('email');
                }

                return null;
            },
        );

        $password = password(
            label: 'Contraseña',
            required: true,
            validate: function (string $value): ?string {
                if (strlen($value) < 8) {
                    return 'La contraseña debe tener al menos 8 caracteres.';
                }

                return null;
            },
        );

        $user = User::create([
            'name' => $name,
            'email' => $email,
            'password' => Hash::make($password),
            'email_verified_at' => now(),
        ]);

        $this->components->info("Usuario administrador creado: {$user->email}");

        return self::SUCCESS;
    }
}
