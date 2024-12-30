<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Carbon\Carbon;

class UserController extends Controller{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(){
        $data = User::orderBy('id', 'asc')->paginate(10);
        return view('admin/content/users/index')->with('data', $data);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create(){
        return view('admin/content/users/create');
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request){
        $request->validate([
            'name' => 'required',
            'email' => 'required|unique:users,email|email',
            'username' => 'required|unique:users,username',
            'password' => 'required|min:8|max:16|regex:/[0-9]/',
            'dob' => 'required|date',
            'sex' => 'required',
            'weight' => 'required|numeric',
            'height' => 'required|numeric',
            'role' => 'required',
        ]);

        user::create([
            'name' => $request->input('name'),
            'email' => $request->input('email'),
            'username' => $request->input('username'),
            'password' => bcrypt($request->input('password')),
            'dob' => $request->input('dob'),
            'sex' => $request->input('sex'),
            'weight' => $request->input('weight'),
            'height' => $request->input('height'),
            'role' => $request->input('role'),
        ]);

        return redirect('admin/users')->with('success', 'User created successfully');
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id){
        $data = user::where('id', $id)->first();
        return view('admin/content/users/detail')->with('data', $data);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id){
        $data = user::where('id', $id)->first();
        return view('admin/content/users/edit')->with('data', $data);
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
            'email' => 'required|email',
            'username' => 'required',
            'dob' => 'required|date',
            'sex' => 'required',
            'weight' => 'required|numeric',
            'height' => 'required|numeric',
            'role' => 'required',
        ]);

        $data = User::findOrFail($id);

        if(
            $data->name === $request->input('name') &&
            $data->email === $request->input('email') &&
            $data->username === $request->input('username') &&
            empty($request->input('password')) &&
            Carbon::parse($data->dob)->toDateString() === Carbon::parse($request->input('dob'))->toDateString() &&
            $data->sex === $request->input('sex') &&
            $data->weight === $request->input('weight') &&
            $data->height === $request->input('height') &&
            $data->role === $request->input('role')
        )return redirect()->back()->withErrors(['No changes detected. Please modify at least one field.']);

        $data->update([
            'name' => $request->input('name'),
            'email' => $request->input('email'),
            'username' => $request->input('username'),
            'password' => $request->input('password') ? bcrypt($request->input('password')) : $data->password,
            'dob' => $request->input('dob'),
            'sex' => $request->input('sex'),
            'weight' => $request->input('weight'),
            'height' => $request->input('height'),
            'role' => $request->input('role'),
        ]);

        return redirect('admin/users')->with('success', 'User updated successfully');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id){
        $data = user::findOrFail($id);
        $data->delete();
        return redirect('admin/users')->with('success', 'User deleted successfully');
    }
}
