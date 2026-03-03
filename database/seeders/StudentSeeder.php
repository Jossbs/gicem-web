<?php

namespace Database\Seeders;

use App\Models\Client\Student;
use Illuminate\Database\Seeder;

class StudentSeeder extends Seeder
{
    public function run(): void
    {
        Student::factory()->count(15)->create();
    }
}
