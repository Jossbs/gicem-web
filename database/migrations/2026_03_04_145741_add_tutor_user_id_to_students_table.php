<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('client.students', function (Blueprint $table) {
            $table->foreignId('tutor_user_id')
                ->nullable()
                ->constrained('client.users')
                ->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('client.students', function (Blueprint $table) {
            $table->dropConstrainedForeignId('tutor_user_id');
        });
    }
};
