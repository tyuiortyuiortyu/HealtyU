<?php

namespace App\Http\Controllers\api\auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use App\Helpers\ApiResponse;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;
use Exception;
use Tymon\JWTAuth\Exceptions\TokenInvalidException;
use App\Helpers\ValidateJwt;
use Illuminate\Support\Facades\Mail;
use App\Mail\ResetPasswordMail;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Illuminate\Support\Facades\DB;

class AuthController extends Controller
{

    public function login(Request $request) {
        $credentials = $request->only('email', 'password');
        $user = User::where('email', $credentials['email'])->where('role', 'user')->first();
    
        if (!$user || $user->role != 'user') {
            return ApiResponse::mapResponse(null, "E002", "Unauthorized User");
        }

        if (!$token = JWTAuth::attempt($credentials)) {
            return ApiResponse::mapResponse(null, "E001");
        }

        $data = [
            'access_token' => $token
        ];

        $user->update([
            'last_login' => now(),
        ]);

        return ApiResponse::mapResponse($data, "S001");
    }

    public function register(Request $request) {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string',
            'email' => 'required|email|unique:users,email',
            'username' => 'required|string|unique:users,username',
            'password' => 'required|string|min:8|confirmed|regex:/[a-z]/|regex:/[A-Z]/|regex:/[0-9]/',
        ]);

        if($validator->fails()){
           return ApiResponse::mapResponse(null,"E002", $validator->errors());
        }

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'username' => $request->username,
            'password' => bcrypt($request->password),
        ]);

        $data = [
            'access_token' => JWTAuth::fromUser($user)
        ];

        return ApiResponse::mapResponse($data, "S001");
    }

    public function logout() {
        try {
            // Ambil token dari request
            $token = JWTAuth::getToken();

            if (!$token || !JWTAuth::parseToken()->authenticate()) {
                return;
            }

            // Invalidate token
            JWTAuth::invalidate($token);

            return ApiResponse::mapResponse(null,"S001");
        } catch (TokenInvalidException $e) {
            return ApiResponse::mapResponse(null,"E004");
        } catch (Exception $e) {
            return ApiResponse::mapResponse(null,"E002", "Failed to logout");
        }
    }
    
    public function getUserData() {
        $user = ValidateJwt::validateAndGetUser();

        $data = [
            'name' => $user->name,
            'email' => $user->email,
            'username' => $user->username,
            'dob' => $user->dob,
            'sex' => $user->sex,
            'weight' => $user->weight,
            'height' => $user->height,
            // 'posts' => $posts
        ];

        return ApiResponse::mapResponse($data, "S001");
    }

    public function resetPassword(Request $request) {
        $request->validate(['email' => 'required|email']);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return ApiResponse::mapResponse(null, "E002", "Unauthorized User");
        }

        $payload = [
            'sub' => $user->id,
            'email' => $user->email,
            'exp' => time() + (60 * 5) // Token berlaku 5 menit
        ];
        $token = JWT::encode($payload, env('JWT_SECRET'), 'HS256');

        DB::table('password_resets')->updateOrInsert(
            ['email' => $user->email],
            ['token' => $token, 'created_at' => now()]
        );

        Mail::to($user->email)->send(new ResetPasswordMail($token));

        return ApiResponse::mapResponse(null, "S001", "Email sent");
    }
}