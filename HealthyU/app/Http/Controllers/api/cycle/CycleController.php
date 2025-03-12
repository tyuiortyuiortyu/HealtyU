<?php

namespace App\Http\Controllers\api\cycle;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;
use App\Helpers\ValidateJwt;
use App\Helpers\ApiResponse;
use Illuminate\Support\Facades\Validator;
use App\Models\Cycle;

class CycleController extends Controller
{
    public function getCycleData(Request $request) {
        $user = ValidateJwt::ValidateAndGetUser();

        if (!$user) {
            return ApiResponse::mapResponse(null, "E002", "Unauthorized User");
        }

        $cycles = Cycle::where('user_id', $user->id)->get();

        return ApiResponse::mapResponse($cycles, "S001");
    }

    public function saveCycle(Request $request) {
        $user = ValidateJwt::validateAndGetUser();
    
        if (!$user) {
            return ApiResponse::mapResponse(null, "E002", "Unauthorized User");
        }

        $validator = Validator::make($request->all(), [
            'start_date' => 'required|date|before_or_equal:today',
            'period_length' => 'required|numeric',
            'cycle_length' => 'required|numeric'
        ]);

        if ($validator->fails()) {
            return ApiResponse::mapResponse(null, "E001", $validator->errors());
        }

        $startDate = $request->start_date;
        $cycleLength = $request->cycle_length;
        $endDate = date('Y-m-d', strtotime($startDate . ' + ' . $cycleLength . ' days'));

        $existingCycle = Cycle::where('user_id', $user->id)
            ->where(function($query) use ($startDate, $endDate) {
                $query->whereBetween('start', [$startDate, $endDate])
                      ->orWhereBetween('end', [$startDate, $endDate])
                      ->orWhere(function($query) use ($startDate, $endDate) {
                          $query->where('start', '<=', $startDate)
                                ->where('end', '>=', $endDate);
                      });
            })
            ->first();

        if ($existingCycle) {
            return ApiResponse::mapResponse(null, "E004", "Cycle overlaps with an existing cycle");
        }

        $cycle = new Cycle();
        $cycle->user_id = $user->id;
        $cycle->start = $startDate;
        $cycle->end = $endDate;
        $cycle->period_len = $request->period_length;
        $cycle->cycle_len = $cycleLength;
        $cycle->save();

        return ApiResponse::mapResponse($cycle, "S001", "Cycle saved successfully");
    }

    public function updateCycle(Request $request, $cycle_id) {
        $user = ValidateJwt::validateAndGetUser();
    
        if (!$user) {
            return ApiResponse::mapResponse(null, "E002", "Unauthorized User");
        }

        $validator = Validator::make($request->all(), [
            'start_date' => 'sometimes|date|before_or_equal:today',
            'period_length' => 'sometimes|numeric',
            'cycle_length' => 'sometimes|numeric'
        ]);

        if ($validator->fails()) {
            return ApiResponse::mapResponse(null, "E001", $validator->errors());
        }

        $cycle = Cycle::where('user_id', $user->id)->where('id', $cycle_id)->first();

        if (!$cycle) {
            return ApiResponse::mapResponse(null, "E003", "Cycle not found");
        }

        if ($request->has('period_length')) {
            $cycle->period_len = $request->period_length;
        }

        // Update the end date based on start date and cycle length
        if ($request->has('start_date') || $request->has('cycle_length')) {
            $startDate = $request->has('start_date') ? $request->start_date : $cycle->start;
            $cycleLength = $request->has('cycle_length') ? $request->cycle_length : $cycle->cycle_len;
            $cycle->end = date('Y-m-d', strtotime($startDate . ' + ' . $cycleLength . ' days'));
        }

        $cycle->save();

        return ApiResponse::mapResponse($cycle, "S001", "Cycle updated successfully");
    }
}