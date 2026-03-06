<?php

namespace App\Notifications;

use App\Models\Client\Anuncio;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class AnuncioNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public Anuncio $anuncio,
        public string $emisorNombre,
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
        $prioridad = $this->anuncio->prioridad->label();
        $alcance = $this->anuncio->alcance->label();
        $subject = $this->anuncio->prioridad->value === 'urgente'
            ? "GICEM [URGENTE] — {$this->anuncio->asunto}"
            : "GICEM — {$this->anuncio->asunto}";

        return (new MailMessage)
            ->subject($subject)
            ->greeting("¡Hola, {$notifiable->name}!")
            ->line('Se ha publicado un nuevo anuncio en el Sistema GICEM.')
            ->line("**Asunto:** {$this->anuncio->asunto}")
            ->line("**Prioridad:** {$prioridad}")
            ->line("**Alcance:** {$alcance}")
            ->line("**Enviado por:** {$this->emisorNombre}")
            ->line('')
            ->line($this->anuncio->mensaje)
            ->salutation('Atentamente, Equipo GICEM');
    }
}
