<?php

namespace App\Helpers;

use Tymon\JWTAuth\Exceptions\JWTException;
use Tymon\JWTAuth\Facades\JWTAuth;

class ValidateJwt
{
    public static function validateAndGetUser()
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();
        } catch (JWTException $e) {
            return ApiResponse::mapResponse(null, "E004");
        }
        return $user;
    }
}
