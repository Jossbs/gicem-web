<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement('create schema if not exists queue;');
        DB::statement('create schema if not exists storage;');
        DB::statement('create schema if not exists authentication;');
        DB::statement('create schema if not exists client;');
    }

    public function down(): void
    {
        DB::statement('drop schema if exists queue;');
        DB::statement('drop schema if exists storage;');
        DB::statement('drop schema if exists authentication;');
        DB::statement('drop schema if exists client;');
    }
};
