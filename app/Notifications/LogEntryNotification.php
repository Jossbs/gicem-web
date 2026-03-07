<?php

namespace App\Notifications;

use App\Models\Client\LogEntry;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class LogEntryNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public LogEntry $logEntry,
        public string $studentName,
        public string $authorName,
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
        $categoria = $this->logEntry->categoria->label();
        $fecha = $this->logEntry->fecha_nota->format('d/m/Y');
        $recipientName = $notifiable->name ?? 'Tutor';

        $subject = match ($this->logEntry->categoria->value) {
            'incidente' => "GICEM [Importante] — Anotación de bitácora: {$this->studentName}",
            default => "GICEM — Anotación de bitácora: {$this->studentName}",
        };

        return (new MailMessage)
            ->subject($subject)
            ->greeting("¡Hola, {$recipientName}!")
            ->line("Se ha registrado una nueva anotación en la bitácora de **{$this->studentName}**.")
            ->line("**Fecha:** {$fecha}")
            ->line("**Tipo de registro:** {$categoria}")
            ->line("**Registrado por:** {$this->authorName}")
            ->line('')
            ->line($this->logEntry->descripcion)
            ->line('')
            ->line('Si tienes alguna duda, no dudes en contactar al centro.')
            ->salutation('Atentamente, Equipo GICEM');
    }
}
