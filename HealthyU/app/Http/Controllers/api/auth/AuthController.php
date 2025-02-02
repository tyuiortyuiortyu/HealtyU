<?php

namespace App\Http\Controllers\api\auth;

use App\Customs\Services\EmailVerificationService;
use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegistrationRequest;
use App\Http\Requests\VerifyEmailRequest;
use App\Http\Requests\ResendEmailVerificationLinkRequest;
use Illuminate\Support\Str;
use App\Models\User;
use Illuminate\Auth\Events\Login;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{

    public function __construct(private EmailVerificationService $service){

    }

    public function login(LoginRequest $request) {
        $credentials = $request->validated();
        $user = \App\Models\User::where('email', $credentials['email'])->first();
    
        if (!$user || $user->role !== 'user') {
            return response()->json([
                'status' => 'failed',
                'message' => 'You are not authorized to log in.'
            ], 403);
        }

        $remember = $request->has('remember');
    
        if (!$token = auth()->attempt($credentials, $remember)) {
            return response()->json([
                'status' => 'failed',
                'message' => 'Invalid Credentials'
            ], 401);
        }
    
        $user->update([
            'last_login' => now(),
            'remember_token' => $remember ? Str::random(60) : null
        ]);
    
        return $this->responseWithToken($token, $user);
    }

    public function resendEmailVerificationLink(ResendEmailVerificationLinkRequest $request){
        return $this->service->resendVerificationLink($request->email);
    }

    public function verifyUserEmail(VerifyEmailRequest $request){
        return $this->service->verifyUserEmail($request->email, $request->token);
    }

    public function register(RegistrationRequest $request){
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'username' => $request->username,
            'password' => bcrypt($request->password)
        ]);

        if($user){
            $this->service->sendVerificationLink($user);
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

    public function logout(){
        $user = auth()->user();
        if($user){
            $user->update(['remember_token' => null]);
        }

        Auth::logout();
        return response()->json(['message' => 'Successfully logged out']);
    }
}
