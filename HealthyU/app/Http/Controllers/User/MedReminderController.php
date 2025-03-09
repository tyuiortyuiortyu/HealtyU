<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class MedReminderController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $medReminders = MedSchedule::with('medicines')->get();
        return response()->json($medReminders, 200);
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
        $request->validate([
            'monday' => 'boolean',
            'tuesday' => 'boolean',
            'wednesday' => 'boolean',
            'thursday' => 'boolean',
            'friday' => 'boolean',
            'saturday' => 'boolean',
            'sunday' => 'boolean',
            'time_to_take' => 'required',
            'med_name' => 'required|string',
            'unit' => 'required|string',
            'med_dose' => 'required|string',
            'food_relation' => 'required|string',
            'duration' => 'required|integer',
        ]);

        DB::transaction(function () use ($request) {
            $schedule = MedSchedule::create($request->only([
                'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday', 'time_to_take'
            ]));

            Medicine::create([
                'med_schedule_id' => $schedule->id,
                'med_name' => $request->med_name,
                'unit' => $request->unit,
                'med_dose' => $request->med_dose,
                'food_relation' => $request->food_relation,
                'duration' => $request->duration,
            ]);
        });

        return response()->json(['message' => 'Data berhasil disimpan'], 201);
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
        $medReminder = MedSchedule::find($id);
        if (!$medReminder) {
            return response()->json(['message' => 'Data tidak ditemukan'], 404);
        }

        $request->validate([
            'monday' => 'boolean',
            'tuesday' => 'boolean',
            'wednesday' => 'boolean',
            'thursday' => 'boolean',
            'friday' => 'boolean',
            'saturday' => 'boolean',
            'sunday' => 'boolean',
            'time_to_take' => 'required',
            'med_name' => 'required|string',
            'unit' => 'required|string',
            'med_dose' => 'required|string',
            'food_relation' => 'required|string',
            'duration' => 'required|integer',
        ]);

        DB::transaction(function () use ($request, $medReminder) {
            $medReminder->update($request->only([
                'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday', 'time_to_take'
            ]));

            $medicine = $medReminder->medicines()->first();
            if ($medicine) {
                $medicine->update([
                    'med_name' => $request->med_name,
                    'unit' => $request->unit,
                    'med_dose' => $request->med_dose,
                    'food_relation' => $request->food_relation,
                    'duration' => $request->duration,
                ]);
            }
        });

        return response()->json(['message' => 'Data berhasil diperbarui'], 200);
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
