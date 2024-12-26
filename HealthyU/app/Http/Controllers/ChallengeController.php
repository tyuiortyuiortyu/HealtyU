<?php

namespace App\Http\Controllers;

use App\Models\challenge;
use Illuminate\Http\Request;

class ChallengeController extends Controller
{
    function index() {
        $data = challenge::orderBy('id', 'asc')->paginate(10);
        return view('admin/index')->with('data', $data);
    }

    function destroy($id) {
        $data = challenge::findOrFail($id);
        $data->delete();
        return redirect()->route('challenges.index')->with('success', 'Challenge deleted successfully');
    }
}
