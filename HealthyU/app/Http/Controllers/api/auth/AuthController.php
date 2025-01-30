<?php

namespace App\Http\Controllers\api\auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegistrationRequest;
use App\Models\User;
use Illuminate\Auth\Events\Login;

class AuthController extends Controller
{
    public function login(LoginRequest $request){
        $token = auth()->attempt($request->validated());

        if($token){
            return $this->responseWithToken($token, auth()->user());
        }else {
            return response()->json([
                'status' => 'failed',
                'message' => 'Invalid Credentials'
            ], 401);
        }
    }

    public function register(RegistrationRequest $request){
        $user = User::create($request->validated());

        if($user){
            $token = auth()->login($user);
            return $this->responseWithToken($token, $user);
        }else {
            return response()->json([
                'status' => 'error',
                'message' => 'Registration failed'
            ], 500);
        }
    }

    public function responseWithToken($token, $user){
        return response()->json([
            'status' => 'success',
            'user' => $user,
            'access_token' => $token,
            'type' => 'bearer',
        ]);
    }
}
