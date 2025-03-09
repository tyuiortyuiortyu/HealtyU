<?php

use App\Http\Controllers\ChallengeController;
use App\Http\Controllers\MedicineController;
use App\Http\Controllers\MedScheduleController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\UnitController;
use App\Http\Controllers\SessionController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

Route::middleware('isLogin')->prefix('admin')->group(function () {
    Route::resource('users', UserController::class);
    Route::resource('challenges', ChallengeController::class);
    Route::resource('medicines', MedicineController::class);
    Route::resource('units', UnitController::class);
    Route::resource('medSchedules', MedScheduleController::class);
});

Route::prefix('session')->group(function () {
    Route::middleware('alreadyLogin')->get('/', [SessionController::class, 'index'])->name('session.index');
    Route::middleware('alreadyLogin')->post('/login', [SessionController::class, 'login'])->name('session.login');
    Route::middleware('notYetLogin')->get('/logout', [SessionController::class, 'logout'])->name('session.logout');
});
