<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Firebase\JWT\ExpiredException;
use App\Models\User;
use Exception;
use Illuminate\Support\Facades\DB;

class PassResetController extends Controller
{
    public function showResetForm(Request $request)
    {
        return view('emails/resetPage', ['token' => $request->query('token')]);
    }

    public function resetPassword(Request $request)
    {
        $request->validate([
            'token' => 'required',
            'password' => 'required|string|min:8|confirmed|regex:/[a-z]/|regex:/[A-Z]/|regex:/[0-9]/'
        ], [
            'token.required' => 'Token is required.',
            'password.required' => 'Password is required.',
            'password.string' => 'Password must be a string.',
            'password.min' => 'Password must be at least 8 characters.',
            'password.confirmed' => 'Password confirmation does not match.',
            'password.regex' => 'Password must include at least one lowercase letter, one uppercase letter, and one number.'
        ]);

        try {
            // Decode token JWT
            $decoded = JWT::decode($request->token, new Key(env('JWT_SECRET'), 'HS256'));

            // Cek token di database
            $resetRecord = DB::table('password_resets')->where('email', $decoded->email)->where('token', $request->token)->first();

            if (!$resetRecord) {
                return back()->with('error', 'Invalid or expired token');
            }

            // Cari user berdasarkan email dari token dan update password
            $user = User::where('email', $decoded->email)->first();
            $user->password = bcrypt($request->password);
            $user->save();

            DB::table('password_resets')->where('email', $decoded->email)->delete();

            return back()->with('success', 'Password successfully updated');
        } catch (ExpiredException $e) {
            return back()->with('error', 'Token expired. Please request a new reset link.');
        } catch (Exception $e) {
            return back()->with('error', 'Invalid or expired token');
        }
    }
}
