<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class UserMedScheduleController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $schedules = MedSchedule::whereHas('medicine', function ($query) {
            $query->where('user_id', Auth::id());
        })->get();

        return response()->json([
            'status' => 'success',
            'message' => 'Daftar jadwal obat berhasil dimuat',
            'data' => $schedules
        ]);
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
        $validated = $request->validate([
            'med_id'     => 'required|exists:medicines,id',
            'time_to_take' => 'required|date_format:H:i',
            'monday'     => 'boolean',
            'tuesday'    => 'boolean',
            'wednesday'  => 'boolean',
            'thursday'   => 'boolean',
            'friday'     => 'boolean',
            'saturday'   => 'boolean',
            'sunday'     => 'boolean',
        ]);

        $medicine = Medicine::where('id', $request->med_id)->where('user_id', Auth::id())->first();
        if (!$medicine) {
            return response()->json([
                'status' => 'error',
                'message' => 'Obat tidak ditemukan'
            ], 403);
        }

        $schedule = MedSchedule::create($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Jadwal berhasil ditambahkan', 
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
        $schedule = MedSchedule::where('id', $id)
            ->whereHas('medicine', function ($query) {
                $query->where('user_id', Auth::id());
            })->first();

        if (!$schedule) {
            return response()->json([
                'status' => 'error',
                'message' => 'Jadwal tidak ditemukan'
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Jadwal berhasil dimuat',
            'data' => $schedule
        ]);
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
        $schedule = MedSchedule::where('id', $id)
            ->whereHas('medicine', function ($query) {
                $query->where('user_id', Auth::id());
            })->first();

        if (!$schedule) {
            return response()->json([
                'status' => 'error',
                'message' => 'Jadwal tidak ditemukan'
            ], 404);
        }

        $validated = $request->validate([
            'time_to_take' => 'sometimes|date_format:H:i',
            'monday'     => 'sometimes|boolean',
            'tuesday'    => 'sometimes|boolean',
            'wednesday'  => 'sometimes|boolean',
            'thursday'   => 'sometimes|boolean',
            'friday'     => 'sometimes|boolean',
            'saturday'   => 'sometimes|boolean',
            'sunday'     => 'sometimes|boolean',
        ]);

        $schedule->update($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Jadwal berhasil diperbarui', 
            'schedule' => $schedule
        ]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $schedule = MedSchedule::where('id', $id)
            ->whereHas('medicine', function ($query) {
                $query->where('user_id', Auth::id());
            })->first();

        if (!$schedule) {
            return response()->json([
                'status' => 'error',
                'message' => 'Jadwal tidak ditemukan'
        ], 404);
        }

        $schedule->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Jadwal berhasil dihapus'
        ]);
    }

    // Menampilkan jadwal minum obat untuk hari ini
    public function getTodaySchedules()
    {
        $day = strtolower(Carbon::now()->format('l')); // Mendapatkan nama hari dalam bahasa Inggris (ex: Monday)
        $schedules = MedSchedule::where($day, true)
            ->whereHas('medicine', function ($query) {
                $query->where('user_id', Auth::id());
            })->get();

        return response()->json([
            'status' => 'success',
            'message' => 'Daftar jadwal obat hari ini berhasil dimuat',
            'data' => $schedules
        ]);
    }

    // Menandai obat sudah diminum
    public function markAsTaken($id)
    {
        $schedule = MedSchedule::where('id', $id)
            ->whereHas('medicine', function ($query) {
                $query->where('user_id', Auth::id());
            })->first();

        if (!$schedule) {
            return response()->json([
                'status' => 'error',
                'message' => 'Jadwal tidak ditemukan'
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Obat sudah ditandai sebagai diminum'
        ]);
    }
}
