<?php

use App\Http\Controllers\AnuncioController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\GroupController;
use App\Http\Controllers\GuardianController;
use App\Http\Controllers\StaffController;
use App\Http\Controllers\StudentController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware('auth')->group(function (): void {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::resource('students', StudentController::class);
    Route::resource('groups', GroupController::class);
    Route::resource('staff', StaffController::class)->middleware('role:admin');
    Route::post('/staff/{staff}/send-invitation', [StaffController::class, 'sendInvitation'])->name('staff.send-invitation')->middleware('role:admin');
    Route::resource('anuncios', AnuncioController::class)->except(['edit', 'update']);
    Route::get('/guardians', [GuardianController::class, 'index'])->name('guardians.index');
    Route::get('/guardians/{student}', [GuardianController::class, 'show'])->name('guardians.show');
    Route::post('/guardians/{student}/create-account', [GuardianController::class, 'createAccount'])->name('guardians.create-account');
    Route::post('/guardians/{student}/send-invitation', [GuardianController::class, 'sendInvitation'])->name('guardians.send-invitation');
});
