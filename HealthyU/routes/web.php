<?php

use App\Http\Controllers\ChallengeController;
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

Route::prefix('admin')->group(function () {
    Route::resource('challenges', ChallengeController::class);
});

Route::get('/session', [SessionController::class, 'index'])->name('session.index');
Route::post('/session/login', [SessionController::class, 'login'])->name('session.login');
Route::get('/session/logout', [SessionController::class, 'logout'])->name('session.logout');
