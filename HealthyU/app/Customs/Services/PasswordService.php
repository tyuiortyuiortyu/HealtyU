<?php

namespace App\Customs\Services;

class PasswordService
{

    private function validateCurrentPassword($currentPassword){
        if(!password_verify($currentPassword, auth()->user()->password)){
            response()->json([
                'status' => 'failed',
                'message' => 'Current password is incorrect'
            ])->send();
            exit;
        }
    }

    public function changePassword($data){
        $this->validateCurrentPassword($data['current_password']);
        $updatePassword = auth()->user()->update([
            'password' => bcrypt($data['password'])
        ]);
        if($updatePassword){
            return response()->json([
                'status' => 'success',
                'message' => 'Password changed successfully'
            ]);
        }else {
            return response()->json([
                'status' => 'failed',
                'message' => 'Failed to change password'
            ]);
        }
    }
}