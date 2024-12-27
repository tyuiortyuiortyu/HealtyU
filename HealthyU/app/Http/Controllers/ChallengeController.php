<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\challenge;
use Illuminate\Support\Facades\Session;

class ChallengeController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(){
        $data = challenge::orderBy('id', 'asc')->paginate(10);
        return view('admin/index')->with('data', $data);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create(){
        return view('admin/create');
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request){
        Session::flash('name', $request->input('name'));
        Session::flash('description', $request->input('description'));
        Session::flash('image', $request->input('image'));

        $request->validate([
            'name' => 'required',
            'description' => 'required',
            'image' => 'required',
        ]);

        challenge::create([
            'name' => $request->input('name'),
            'description' => $request->input('description'),
            'image' => $request->input('image'),
        ]);

        return redirect('admin/challenges')->with('success', 'Challenge created successfully');
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id){
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id){
        $data = challenge::where('id', $id)->first();
        return view('admin.edit')->with('data', $data);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id){
        $request->validate([
            'name' => 'required',
            'description' => 'required',
            'image' => 'required',
        ]);

        $challenge = challenge::findOrFail($id);

        if(
            $challenge->name === $request->input('name') &&
            $challenge->description === $request->input('description') &&
            $challenge->image === $request->input('image')
        )return redirect()->back()->withErrors(['No changes detected. Please modify at least one field.']);

        $challenge->update([
            'name' => $request->input('name'),
            'description' => $request->input('description'),
            'image' => $request->input('image'),
        ]);

        return redirect('admin/challenges')->with('success', 'Challenge updated successfully');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id){
        $data = challenge::findOrFail($id);
        $data->delete();
        return redirect()->route('challenges.index')->with('success', 'Challenge deleted successfully');
    }
}
