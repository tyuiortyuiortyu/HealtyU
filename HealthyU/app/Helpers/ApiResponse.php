<?php
namespace App\Helpers;


class ApiResponse{

    public $responseMessage = [
        "S001" => "Success",
        "E001" => "Invalid credentials",
        "E002" => "Bad Request",
        "E003" => "Invalid Format",
        "E004" => "Invalid Token",
        "E005" => "Token not provided",
    ];

    public static function mapResponse($data=[], $code = 'S001', $additional_message = ''){
        return response()->json([
            'error_schema' => [
                'error_code' => $code,
                'error_message' => (new self)->responseMessage[$code],
                'additional_message' => $additional_message
            ],
            'output_schema' => $data
        ]);
    }
}
