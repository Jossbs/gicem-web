<?php

namespace Database\Seeders;

use App\Models\Client\Group;
use Illuminate\Database\Seeder;

class GroupSeeder extends Seeder
{
    public function run(): void
    {
        Group::factory()->count(8)->create();
    }
}
