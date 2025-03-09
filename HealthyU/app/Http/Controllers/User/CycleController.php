<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Cycle;
use App\Http\Resources\CycleResource;
use Illuminate\Support\Facades\Auth;

class CycleController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $cycles = Cycle::where('user_id', Auth::id())->get();
        return response()->json([
            'status' => 'success',
            'data' => $cycles
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
            'start' => 'required|date',
            'end' => 'required|date|after_or_equal:start',
            'cycle_len' => 'required|integer',
            'period_len' => 'required|integer',
            'pain_lv' => 'required|integer',
            'bleeding_lv' => 'required|integer',
            'mood_lv' => 'required|integer'
        ]);
    
        $userId = Auth::id();
    
        // Cek apakah user sudah memiliki cycle
        $existingCycle = Cycle::where('user_id', $userId)->first();
    
        if ($existingCycle) {
            return response()->json([
                'status' => 'error',
                'message' => 'User already has a cycle record. Please update the existing cycle instead.'
            ], 400);
        }
    
        // Jika belum ada, buat cycle baru
        $cycle = Cycle::create([
            'user_id' => $userId,
            'start' => $validated['start'],
            'end' => $validated['end'],
            'cycle_len' => $validated['cycle_len'],
            'period_len' => $validated['period_len'],
            'pain_lv' => $validated['pain_lv'],
            'bleeding_lv' => $validated['bleeding_lv'],
            'mood_lv' => $validated['mood_lv']
        ]);
    
        return response()->json([
            'status' => 'success',
            'message' => 'Cycle created successfully',
            'data' => $cycle
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
        $cycle = Cycle::where('user_id', Auth::id())->findOrFail($id);

        return response()->json([
            'status' => 'success',
            'data' => $cycle
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
    public function update(Request $request)
    {
        // Cek user yang sedang login
        $userId = Auth::id();

        // Cari cycle berdasarkan user_id
        $cycle = Cycle::where('user_id', $userId)->first();

        if (!$cycle) {
            return response()->json([
                'status' => 'error',
                'message' => 'No existing cycle record found. Please create a cycle first.'
            ], 404);
        }

        // Validasi request
        $validated = $request->validate([
            'start' => 'required|date',
            'end' => 'required|date|after_or_equal:start',
            'cycle_len' => 'required|integer',
            'period_len' => 'required|integer',
            'pain_lv' => 'required|integer',
            'bleeding_lv' => 'required|integer',
            'mood_lv' => 'required|integer'
        ]);

        // Update data cycle
        $cycle->update($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Cycle updated successfully',
            'data' => $cycle
        ]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy()
    {
        $cycle = Cycle::where('user_id', Auth::id())->first();

        if (!$cycle) {
            return response()->json([
                'status' => 'error',
                'message' => 'No cycle found for this user'
            ], 404);
        }

        // Hapus cycle yang ditemukan
        $cycle->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Cycle deleted successfully'
        ]);
    }
}
