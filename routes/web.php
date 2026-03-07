<?php

use App\Http\Controllers\AnuncioController;
use App\Http\Controllers\AttendanceController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\GroupController;
use App\Http\Controllers\GuardianController;
use App\Http\Controllers\ImpersonateRoleController;
use App\Http\Controllers\LegalController;
use App\Http\Controllers\LogEntryController;
use App\Http\Controllers\StaffController;
use App\Http\Controllers\StudentController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::get('/aviso-de-privacidad', [LegalController::class, 'privacy'])->name('legal.privacy');
Route::get('/terminos-y-condiciones', [LegalController::class, 'terms'])->name('legal.terms');

Route::middleware('auth')->group(function (): void {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::resource('students', StudentController::class);
    Route::get('/students/{student}/export-pdf', [StudentController::class, 'exportPdf'])->name('students.export-pdf');
    Route::resource('students.log-entries', LogEntryController::class)->only(['index', 'create', 'store', 'destroy']);

    Route::get('/attendance', [AttendanceController::class, 'index'])->name('attendance.index');
    Route::get('/attendance/{group}/take', [AttendanceController::class, 'take'])->name('attendance.take');
    Route::post('/attendance/{group}', [AttendanceController::class, 'store'])->name('attendance.store');
    Route::get('/attendance/{group}/show', [AttendanceController::class, 'show'])->name('attendance.show');
    Route::resource('groups', GroupController::class);
    Route::resource('staff', StaffController::class)->middleware('role:admin');
    Route::post('/staff/{staff}/send-invitation', [StaffController::class, 'sendInvitation'])->name('staff.send-invitation')->middleware('role:admin');
    Route::resource('anuncios', AnuncioController::class)->except(['edit', 'update']);
    Route::get('/guardians', [GuardianController::class, 'index'])->name('guardians.index');
    Route::get('/guardians/{student}', [GuardianController::class, 'show'])->name('guardians.show');
    Route::post('/guardians/{student}/create-account', [GuardianController::class, 'createAccount'])->name('guardians.create-account');
    Route::post('/guardians/{student}/send-invitation', [GuardianController::class, 'sendInvitation'])->name('guardians.send-invitation');

    Route::post('/impersonate/start', [ImpersonateRoleController::class, 'start'])->name('impersonate.start');
    Route::post('/impersonate/stop', [ImpersonateRoleController::class, 'stop'])->name('impersonate.stop');
});
