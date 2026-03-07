<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class InvitationNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public string $token,
    ) {}

    /**
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $url = url("/reset-password/{$this->token}?email=".urlencode($notifiable->email));
        $expirationMinutes = config('auth.passwords.users.expire', 60);

        $isNewAccount = is_null($notifiable->email_verified_at);
        $name = $notifiable->name;

        return (new MailMessage)
            ->subject($isNewAccount
                ? 'GICEM — Tu cuenta ha sido creada'
                : 'GICEM — Has sido invitado a la plataforma')
            ->view('mail.invitation', [
                'greeting' => $isNewAccount
                    ? "Bienvenido/a, {$name}"
                    : "Hola de nuevo, {$name}",
                'subgreeting' => $isNewAccount
                    ? 'Se ha creado una cuenta para ti en el Sistema GICEM.'
                    : 'Tu cuenta en el Sistema GICEM esta lista para activarse.',
                'introLine' => $isNewAccount
                    ? 'Un administrador ha creado tu cuenta en la plataforma de Gestion Integral para Centros de Educacion Multiple. Para comenzar, solo necesitas crear tu contrasena.'
                    : 'Te recordamos que tienes una cuenta pendiente de activar en la plataforma GICEM. Crea tu contrasena para empezar a utilizarla.',
                'benefits' => [
                    'Consultar expedientes e informacion de alumnos',
                    'Recibir anuncios y comunicados importantes',
                    'Acceder al registro de asistencia y calificaciones',
                    'Mantener comunicacion directa con el centro educativo',
                ],
                'actionUrl' => $url,
                'expirationMinutes' => $expirationMinutes,
            ]);
    }
}
