<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Medicine;
use App\Models\MedSchedule;

class MedReminderController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        // Ambil user_id dari user yang sedang login
        $userId = auth()->id();

        // Ambil semua medicines yang dimiliki user beserta jadwalnya
        $medReminders = Medicine::with('schedules')->where('user_id', $userId)->get();

        return response()->json([
            'message' => 'Data retrieved successfully',
            'data' => $medReminders 
        ], 200);
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
        // Validasi input
        $validatedData = $request->validate([
            'med_name' => 'required|string|max:255',
            'unit' => 'required|string|in:ml,mg',
            'med_dose' => 'required|string|max:50',
            'food_relation' => 'required|string|max:50',
            'duration' => 'required|integer',
            'monday' => 'boolean',
            'tuesday' => 'boolean',
            'wednesday' => 'boolean',
            'thursday' => 'boolean',
            'friday' => 'boolean',
            'saturday' => 'boolean',
            'sunday' => 'boolean',
            'time_to_take' => 'required|date_format:H:i:s'
        ]);

        // Dapatkan ID user yang sedang login
        $userId = auth()->id();

        // Konversi nama unit menjadi unit_id
        $unitId = ($validatedData['unit'] === 'mg') ? 1 : 2;

        // Simpan ke tabel medicines
        $medicine = Medicine::create([
            'user_id' => $userId,
            'med_name' => $validatedData['med_name'],
            'unit_id' => $unitId,
            'med_dose' => $validatedData['med_dose'],
            'food_relation' => $validatedData['food_relation'],
            'duration' => $validatedData['duration']
        ]);

        // Simpan ke tabel med_schedules dengan foreign key dari medicines
        $schedule = MedSchedule::create([
            'med_id' => $medicine->id,
            'monday' => $validatedData['monday'] ?? false,
            'tuesday' => $validatedData['tuesday'] ?? false,
            'wednesday' => $validatedData['wednesday'] ?? false,
            'thursday' => $validatedData['thursday'] ?? false,
            'friday' => $validatedData['friday'] ?? false,
            'saturday' => $validatedData['saturday'] ?? false,
            'sunday' => $validatedData['sunday'] ?? false,
            'time_to_take' => $validatedData['time_to_take']
        ]);

        return response()->json([
            'message' => 'Medicine and schedule created successfully',
            'medicine' => $medicine,
            'schedule' => $schedule
        ], 201);
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
        // Cari data schedule berdasarkan ID
        $schedule = MedSchedule::findOrFail($id);
        
        // Cari data medicine berdasarkan foreign key di med_schedules
        $medicine = Medicine::findOrFail($schedule->med_id);

        // Cek apakah user yang login adalah pemilik data
        if ($medicine->user_id !== auth()->id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Validasi input
        $validatedData = $request->validate([
            'med_name' => 'required|string|max:255',
            'unit' => 'required|string|in:ml,mg',
            'med_dose' => 'required|string|max:50',
            'food_relation' => 'required|string|max:50',
            'duration' => 'required|integer',
            'monday' => 'boolean',
            'tuesday' => 'boolean',
            'wednesday' => 'boolean',
            'thursday' => 'boolean',
            'friday' => 'boolean',
            'saturday' => 'boolean',
            'sunday' => 'boolean',
            'time_to_take' => 'required|date_format:H:i:s'
        ]);

        // Konversi nama unit menjadi unit_id
        $unitId = ($validatedData['unit'] === 'mg') ? 1 : 2;

        // Update data medicine
        $medicine->update([
            'med_name' => $validatedData['med_name'],
            'unit_id' => $unitId,
            'med_dose' => $validatedData['med_dose'],
            'food_relation' => $validatedData['food_relation'],
            'duration' => $validatedData['duration']
        ]);

        // Update data schedule
        $schedule->update([
            'monday' => $validatedData['monday'] ?? false,
            'tuesday' => $validatedData['tuesday'] ?? false,
            'wednesday' => $validatedData['wednesday'] ?? false,
            'thursday' => $validatedData['thursday'] ?? false,
            'friday' => $validatedData['friday'] ?? false,
            'saturday' => $validatedData['saturday'] ?? false,
            'sunday' => $validatedData['sunday'] ?? false,
            'time_to_take' => $validatedData['time_to_take']
        ]);

        return response()->json([
            'message' => 'Medicine and schedule updated successfully',
            'medicine' => $medicine,
            'schedule' => $schedule
        ], 200);
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
            return response()->json(['message' => 'Data tidak ditemukan'], 404);
        }

        DB::transaction(function () use ($medReminder) {
            $medReminder->medicines()->delete();
            $medReminder->delete();
        });

        return response()->json(['message' => 'Data berhasil dihapus'], 200);
    }
}
