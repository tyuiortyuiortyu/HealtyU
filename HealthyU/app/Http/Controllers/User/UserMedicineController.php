<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
use App\Models\Medicine;

class UserMedicineController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $medicines = Medicine::where('user_id', Auth::id())->with('unit')->get();
        return response()->json([
            'status' => 'success',
            'message' => 'Daftar obat berhasil dimuat',
            'data' => $medicines
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
        // Daftar unit yang valid
        $units = [
            'mg' => 1,
            'ml' => 2,
            'tablet(s)' => 3
        ];

        $validated = $request->validate([
            'unit' => ['required', Rule::in(array_keys($units))], // Validasi nama unit
            'med_name' => 'required|string|max:255',
            'med_dose' => 'required|numeric',
            'food_relation' => 'required|in:before,after,with',
            'duration' => 'required|integer',
        ]);

        // Konversi unit ke unit_id
        $validated['unit_id'] = $units[$validated['unit']];
        unset($validated['unit']); // Hapus 'unit' karena tidak perlu disimpan
        
        $medicine = Medicine::create(array_merge($validated, ['user_id' => Auth::id()]));

        return response()->json([
            'message' => 'Obat berhasil ditambahkan',
            'medicine' => $medicine
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
        $medicine = Medicine::where('id', $id)->where('user_id', Auth::id())->with('unit')->first();
        if (!$medicine) {
            return response()->json([
                'status' => 'error',
                'message' => 'Obat tidak ditemukan'
            ],404);
        }
        return response()->json([
            'status' => 'success',
            'message' => 'Obat berhasil dimuat',
            'data' => $medicine
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
        $medicine = Medicine::where('id', $id)->where('user_id', Auth::id())->first();
        if (!$medicine) {
            return response()->json([
                'status' => 'error',
                'message' => 'Obat tidak ditemukan'
            ], 404);
        }

        $units = [
            'mg' => 1,
            'ml' => 2,
            'tablet(s)' => 3
        ];
        
        $validated = $request->validate([
            'unit' => ['required', Rule::in(array_keys($units))],
            'med_name' => 'string|max:255',
            'med_dose' => 'numeric',
            'food_relation' => 'in:before,after,with',
            'duration' => 'integer',
        ]);
        
        $validated['unit_id'] = $units[$validated['unit']];
        unset($validated['unit']);

        $medicine->update($validated);
        return response()->json([
            'status' => 'success',
            'message' => 'Obat berhasil diperbarui',
            'medicine' => $medicine
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
        $medicine = Medicine::where('id', $id)->where('user_id', Auth::id())->first();
        if (!$medicine) {
            return response()->json([
                'status' => 'error',
                'message' => 'Obat tidak ditemukan'
            ], 404);
        }
        
        $medicine->delete();
        return response()->json([
            'status' => 'success',
            'message' => 'Obat berhasil dihapus'
        ]);
    }
}
