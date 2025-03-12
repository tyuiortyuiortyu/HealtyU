<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\api\auth\AuthController;
use App\Http\Middleware\JwtMiddleware;
use App\Http\Controllers\api\community\CommunityController;
use App\Http\Controllers\api\cycle\CycleController;
use App\Http\Controllers\api\med_reminder\MedReminderController;
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
    Route::post('/resetPassword', [AuthController::class, 'resetPassword']);
    Route::post('/updateProfile', [AuthController::class, 'updateProfile'])->middleware(JwtMiddleware::class);
});

route::prefix('community')->group(function(){
    Route::post('/likePost', [CommunityController::class, 'likePost']);
    Route::get('/getPosts', [CommunityController::class, 'getPosts']);
    Route::post('/createPost', [CommunityController::class, 'createPost']);
    Route::delete('/deletePost/{id}', [CommunityController::class, 'deletePost']);
    Route::post('/posts/{post_id}/comments', [CommunityController::class, 'addComment']);
    Route::get('/posts/{post_id}/comments', [CommunityController::class, 'getComments']);
    Route::delete('/posts/{post_id}/comments/{comment_id}', [CommunityController::class, 'deleteComment']);
})->middleware(JwtMiddleware::class);

route::prefix('cycles')->group(function(){
    Route::get('/getCycle', [CycleController::class, 'getCycleData']);
    Route::post('/saveCycle', [CycleController::class, 'saveCycle']);
    Route::patch('/updateCycle/{cycle_id}', [CycleController::class, 'updateCycle']);
})->middleware(JwtMiddleware::class);

route::prefix('MedReminder')->group(function(){
    Route::get('/MedReminder', [MedReminderController::class, 'index']); // Ambil semua data siklus user
    Route::post('/MedReminder', [MedReminderController::class, 'store']); // Simpan data siklus baru
    Route::get('/MedReminder/{id}', [MedReminderController::class, 'show']); // Ambil detail siklus berdasarkan ID
    Route::post('/MedReminder/update/{id}', [MedReminderController::class, 'update']); // Perbarui siklus berdasarkan ID
    Route::delete('/MedReminder/{id}', [MedReminderController::class, 'destroy']); // Hapus siklus berdasarkan ID
});