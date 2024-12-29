<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\challenge;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Session;

class ChallengeController extends Controller    {
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(){
        $data = challenge::orderBy('id', 'asc')->paginate(10);
        return view('admin/content/index')->with('data', $data);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create(){
        return view('admin/content/create');
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
            'image' => 'required | mimes:jpeg,jpg,png',
        ]);

        $photo_file = $request->file('image');
        $photo_ext = $photo_file->extension();
        $photo_name = date('YmdHis') . '.' . $photo_ext;
        $photo_file->move(public_path('images'), $photo_name);

        challenge::create([
            'name' => $request->input('name'),
            'description' => $request->input('description'),
            'image' => $photo_name,
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
        $data = challenge::where('id', $id)->first();
        return view('admin/content/detail')->with('data', $data);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id){
        $data = challenge::where('id', $id)->first();
        return view('admin/content/edit')->with('data', $data);
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
        ]);

        $data = challenge::findOrFail($id);
        
        if(
            $data->name === $request->input('name') &&
            $data->description === $request->input('description') &&
            $data->image === $request->input('image')
        )return redirect()->back()->withErrors(['No changes detected. Please modify at least one field.']);
            
        if($request->hasFile('image')){
            $request->validate([
                'image' => 'required | mimes:jpeg,jpg,png',
            ]);

            $photo_file = $request->file('image');
            $photo_ext = $photo_file->extension();
            $photo_name = date('YmdHis') . '.' . $photo_ext;
            $photo_file->move(public_path('images'), $photo_name);
        
            File::delete(public_path('images/' . $data->image));
        }

        $data->update([
            'name' => $request->input('name'),
            'description' => $request->input('description'),
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
        File::delete(public_path('images/' . $data->image));
        $data->delete();
        return redirect()->route('challenges.index')->with('success', 'Challenge deleted successfully');
    }
}
