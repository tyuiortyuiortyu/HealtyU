<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\api\auth\AuthController;
use App\Http\Middleware\JwtMiddleware;
use App\Http\Controllers\api\community\CommunityController;
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
    Route::post('/likePost', [CommunityController::class, 'likePost'])->middleware(JwtMiddleware::class);
    Route::get('/getPosts', [CommunityController::class, 'getPosts'])->middleware(JwtMiddleware::class);
});