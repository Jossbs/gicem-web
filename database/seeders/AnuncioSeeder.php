<?php

namespace Database\Seeders;

use App\Models\Client\Anuncio;
use Illuminate\Database\Seeder;

class AnuncioSeeder extends Seeder
{
    public function run(): void
    {
        Anuncio::factory()->count(10)->create();
    }
}
