<?php

    namespace App\Http\Controllers\api\med_reminder;

    use App\Http\Controllers\Controller;
    use Illuminate\Http\Request;
    use App\Models\Medicine;
    use App\Models\MedSchedule;
    use Illuminate\Support\Facades\DB;
    use Illuminate\Support\Facades\Log;
    use App\Helpers\ApiResponse;
    use Tymon\JWTAuth\Facades\JWTAuth;
    use App\Helpers\ValidateJwt;
    use Illuminate\Support\Facades\Validator;

    class MedReminderController extends Controller
    {
        /**
         * Display a listing of the resource.
         *
         * @return \Illuminate\Http\Response
         */
        public function index(Request $request)
        {
            // Ambil user_id dari user yang sedang login
            $user = ValidateJwt::validateAndGetUser();

            if (!$user) {
                return ApiResponse::mapResponse(null, "E002");
            }

            // Ambil semua medicines yang dimiliki user beserta jadwalnya
            $medReminders = Medicine::with('schedules')->where('user_id', $user->id)->get();

            // return response()->json([
            //     'message' => 'Data retrieved successfully',
            //     'data' => $medReminders 
            // ], 200);

            return ApiResponse::mapResponse($medReminders, "S001");
        }

        /**
         * Show the form for creating a new resource.
         *
         * @return \Illuminate\Http\Response
         */
        public function create()
        {
            //
        }

        /**
         * Store a newly created resource in storage.
         *
         * @param  \Illuminate\Http\Request  $request
         * @return \Illuminate\Http\Response
         */
        public function store(Request $request)
        {
            try {
                // Log request masuk
                Log::info('Incoming request:', $request->all());
        
                // Validasi input
                $validatedData = $request->validate([
                    'med_name' => 'required|string|max:255',
                    'unit' => 'required|string|in:ml,mg',
                    'med_dose' => 'required|numeric|min:0.1',
                    'type' => 'required|string|in:Pil,Sirup,Tetes,Krim,Tablet',
                    'time_to_take' => 'required|date_format:H:i:s',
                    'monday' => 'required|boolean',
                    'tuesday' => 'required|boolean',
                    'wednesday' => 'required|boolean',
                    'thursday' => 'required|boolean',
                    'friday' => 'required|boolean',
                    'saturday' => 'required|boolean',
                    'sunday' => 'required|boolean'
                ]);
        
                // Periksa autentikasi
                $user = ValidateJwt::validateAndGetUser();
                if (!$user->id) {
                    return ApiResponse::mapResponse(null, "E002", "Unauthorized");
                }
        
                $unitId = ($validatedData['unit'] === 'mg') ? 1 : 2;
        
                // Simpan data
                $medicine = Medicine::create([
                    'user_id' => $user->id,
                    'med_name' => $validatedData['med_name'],
                    'unit_id' => $unitId,
                    'med_dose' => $validatedData['med_dose'],
                    'type' => $validatedData['type'],
                ]);
        
                $schedule = MedSchedule::create([
                    'med_id' => $medicine->id,
                    'time_to_take' => $validatedData['time_to_take'],
                    'monday' => $validatedData['monday'],
                    'tuesday' => $validatedData['tuesday'],
                    'wednesday' => $validatedData['wednesday'],
                    'thursday' => $validatedData['thursday'],
                    'friday' => $validatedData['friday'],
                    'saturday' => $validatedData['saturday'],
                    'sunday' => $validatedData['sunday']
                ]);
        
                $units = [
                    1 => 'mg',
                    2 => 'ml'
                ];
        
                return ApiResponse::mapResponse([
                    'medicine' => $medicine,
                    'schedule' => $schedule
                ], "S001", "Medicine and schedule created successfully");
        
            } catch (\Exception $e) {
                // Log error
                Log::error('Error storing medicine:', ['error' => $e->getMessage()]);
                return ApiResponse::mapResponse(null, "E002", "Something went wrong");
            }
        }

        /**
         * Display the specified resource.
         *
         * @param  int  $id
         * @return \Illuminate\Http\Response
         */
        public function show($id)
        {
            $medReminder = MedSchedule::with('medicines')->find($id);
            if (!$medReminder) {
                return response()->json(['message' => 'Data tidak ditemukan'], 404);
            }

            return response()->json($medReminder, 200);
        }

        /**
         * Show the form for editing the specified resource.
         *
         * @param  int  $id
         * @return \Illuminate\Http\Response
         */
        public function edit($id)
        {
            //
        }

        /**
         * Update the specified resource in storage.
         *
         * @param  \Illuminate\Http\Request  $request
         * @param  int  $id
         * @return \Illuminate\Http\Response
         */
        public function update(Request $request, $id)
        {
            $user = ValidateJwt::validateAndGetUser();

            if (!$user) {
                return ApiResponse::mapResponse(null, "E002");
            }

            $validator = Validator::make($request->all(), [
                'med_name' => 'required|string|max:255',
                'unit' => 'required|string|in:ml,mg',
                'med_dose' => 'required|numeric|max:50',
                'type' => 'required|string|in:Pil,Sirup,Tetes,Krim,Tablet',
                'time_to_take' => 'required|date_format:H:i:s',
                'monday' => 'required|boolean',
                'tuesday' => 'required|boolean',
                'wednesday' => 'required|boolean',
                'thursday' => 'required|boolean',
                'friday' => 'required|boolean',
                'saturday' => 'required|boolean',
                'sunday' => 'required|boolean',
            ]);

            if ($validator->fails()) {
                return ApiResponse::mapResponse(null, "E002", $validator->errors());
            }

            // Ambil schedule berdasarkan ID
            $schedule = MedSchedule::where('id', $id)->first();
            if (!$schedule) {
                return ApiResponse::mapResponse(null, "E002", "Data tidak ditemukan");
            }

            // Ambil medicine berdasarkan med_id dari schedule
            $medicine = Medicine::where('id', $schedule->med_id)->first();
            if (!$medicine) {
                return ApiResponse::mapResponse(null, "E002", "Medicine data not found");
            }

            // Update data medicine
            $medicine->update([
                'med_name' => $request->med_name,
                'unit_id' => $request->unit === 'mg' ? 1 : 2,
                'med_dose' => $request->med_dose,
                'type' => $request->type,
            ]);

            // Update data schedule
            $schedule->update([
                'time_to_take' => $request->time_to_take,
                'monday' => $request->monday,
                'tuesday' => $request->tuesday,
                'wednesday' => $request->wednesday,
                'thursday' => $request->thursday,
                'friday' => $request->friday,
                'saturday' => $request->saturday,
                'sunday' => $request->sunday,
            ]);

            return ApiResponse::mapResponse([
                'medicine' => $medicine,
                'schedule' => $schedule
            ], "S001", "Medicine and schedule updated successfully");
        }


        /**
         * Remove the specified resource from storage.
         *
         * @param  int  $id
         * @return \Illuminate\Http\Response
         */
        public function destroy($id)
        {
            $medReminder = MedSchedule::find($id);
            if (!$medReminder) {
                return ApiResponse::mapResponse(null, "E002", "Data tidak ditemukan");
            }
        
            DB::transaction(function () use ($medReminder) {
                $medReminder->medicines()->delete();
                $medReminder->delete();
            });
        
            return ApiResponse::mapResponse(null, "S001", "Data berhasil dihapus");
        }
    }