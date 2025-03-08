<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\api\auth\AuthController;
use App\Http\Middleware\JwtMiddleware;
use App\Http\Controllers\User\CycleController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

route::prefix('auth')->group(function(){
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/getUserData', [AuthController::class, 'getUserData'])->middleware(JwtMiddleware::class);
});

Route::middleware('jwt')->group(function () {
    Route::get('/cycles', [CycleController::class, 'index']); // Ambil semua data siklus user
    Route::post('/cycles', [CycleController::class, 'store']); // Simpan data siklus baru
    Route::get('/cycles/{id}', [CycleController::class, 'show']); // Ambil detail siklus berdasarkan ID
    Route::post('/cycles/update', [CycleController::class, 'update']); // Perbarui siklus berdasarkan ID
    Route::delete('/cycles', [CycleController::class, 'destroy']); // Hapus siklus berdasarkan ID
});