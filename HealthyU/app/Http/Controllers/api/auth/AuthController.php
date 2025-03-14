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
            'last_login' => now(),
        ]);

        $data = [
            'access_token' => JWTAuth::fromUser($user)
        ];

        return ApiResponse::mapResponse($data, "S001");
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
            'profile_picture' => $user->profile_picture ? asset($user->profile_picture) : asset('storage/profile_pic/default.png'),
        ];

        return ApiResponse::mapResponse($data, "S001");
    }

    public function updateProfile(Request $request) {
        $user = ValidateJwt::validateAndGetUser();
    
        if (!$user) {
            return ApiResponse::mapResponse(null, "E002", "Unauthorized User");
        }
    
        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string',
            'email' => 'sometimes|required|email|unique:users,email,'.$user->id,
            'username' => 'sometimes|required|string|unique:users,username,'.$user->id,
            'dob' => 'nullable|date',
            'sex' => 'nullable|in:male,female',
            'height' => 'nullable|numeric|min:50|max:300',
            'weight' => 'nullable|numeric|min:10|max:500',
            'profile_picture' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
        ]);
    
        if ($validator->fails()) {
            return ApiResponse::mapResponse(null, "E002", $validator->errors());
        }
    
        // Jika ada file gambar yang diupload
        if ($request->hasFile('profile_picture')) {
            // Hapus foto lama jika ada
            if ($user->profile_picture) {
                $oldImagePath = storage_path('app/public/' . str_replace('storage/', '', $user->profile_picture));
                if (file_exists($oldImagePath)) {
                    unlink($oldImagePath);
                }
            }
    
            // Simpan gambar baru
            $imagePath = $request->file('profile_picture')->store('profile_pic', 'public');
            $imageUrl = asset("storage/$imagePath"); // Buat URL lengkap
            $user->profile_picture = $imageUrl;
        }
    
        $user->update($request->only([
            'name', 'email', 'username', 'dob', 'sex', 'height', 'weight'
        ]) + ['profile_picture' => $user->profile_picture]);
    
        $data = [
            'name' => $user->name,
            'email' => $user->email,
            'username' => $user->username,
            'dob' => $user->dob,
            'sex' => $user->sex,
            'weight' => $user->weight,
            'height' => $user->height,
            'profile_picture' => $user->profile_picture,
        ];
    
        return ApiResponse::mapResponse($data, "S001", "Profile updated");
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
        $token = JWT::encode($payload, (string) env('JWT_SECRET'), 'HS256');

        DB::table('password_resets')->updateOrInsert(
            ['email' => $user->email],
            ['token' => $token, 'created_at' => now()]
        );

        Mail::to($user->email)->send(new ResetPasswordMail($token));

        return ApiResponse::mapResponse(null, "S001", "Email sent");
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
}