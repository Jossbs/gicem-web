<?php

namespace Database\Factories;

use App\Enums\AlcanceAnuncio;
use App\Enums\PrioridadAnuncio;
use App\Enums\TipoEmisor;
use App\Models\Client\Anuncio;
use App\Models\Client\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Anuncio>
 */
class AnuncioFactory extends Factory
{
    protected $model = Anuncio::class;

    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'tipo_emisor' => fake()->randomElement(TipoEmisor::cases()),
            'alcance' => fake()->randomElement(AlcanceAnuncio::cases()),
            'asunto' => fake()->sentence(6),
            'mensaje' => fake()->paragraphs(3, true),
            'prioridad' => fake()->randomElement(PrioridadAnuncio::cases()),
            'fecha_envio' => now(),
        ];
    }
}
