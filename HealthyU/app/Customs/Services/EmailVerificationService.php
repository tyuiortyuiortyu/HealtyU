<?php

namespace App\Customs\Services;

use App\Http\Requests\ResendEmailVerificationLinkRequest;
use App\Models\EmailVerificationToken;
use App\Notifications\EmailVerificationNotification;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Notification;
use App\Models\User;

class EmailVerificationService
{

    public function sendVerificationLink(object $user): void{
        Notification::send($user, new EmailVerificationNotification($this->generateVerificationLink($user->email)));
    }

    public function resendVerificationLink($email){
        $user = User::where('email', $email)->first();
        if($user){
            $this->sendVerificationLink($user);
            return response()->json([
                'status' => 'success',
                'message' => 'Verification link sent successfully'
            ]);

        }else {
            return response()->json([
                'status' => 'failed',
                'message' => 'User not found'
            ]);
        }
    }

    public function checkIfEmailIsVerified($user){
        if($user->email_verified_at){
            response()->json([
                'status' => 'failed',
                'message' => 'Email has already been verified'
            ])->send();
            exit;
        }
    }

    public function verifyUserEmail(string $email, string $token){
        $user = User::where('email', $email)->first();
        if(!$user){
            response()->json([
                'status' => 'failed',
                'message' => 'User not found'
            ])->send();
            exit;
        }$this->checkIfEmailIsVerified($user);
        $verifiedToken = $this->verifyToken($email, $token);
        if($user->markEmailAsVerified()){
            $verifiedToken->delete();
            response()->json([
                'status' => 'success',
                'message' => 'Email verified successfully'
            ])->send();
        }else {
            return response()->json([
                'status' => 'failed',
                'message' => 'Failed to verify email, please try again later'
            ]);
        }
    }

    public function verifyToken(string $email, string $token){
        $token = EmailVerificationToken::where('email', $email)->where('token', $token)->first();
        if($token){
            if($token->expires_at >= now()){
                return $token;
            }else{
                $token->delete();
                response()->json([
                    'status' => 'failed',
                    'message' => 'Token expired'
                ])->send();
                exit;
            }
        }else{
            response()->json([
                'status' => 'failed',
                'message' => 'Invalid token'
            ])->send();
            exit;
        }
    }

    public function generateVerificationLink(string $email): string{
        $checkIfTokenExists = EmailVerificationToken::where('email', $email)->first();
        if($checkIfTokenExists) $checkIfTokenExists->delete();
        $token = Str::uuid();
        $url = config('app.url'). "?token=". $token. "&email=". $email;
        $saveToken = EmailVerificationToken::create([
            'email' => $email,
            'token' => $token,
            'expires_at' => now()->addMinutes(60),
        ]);
        if($saveToken) return $url;
    }
}