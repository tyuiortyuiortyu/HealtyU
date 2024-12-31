<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Session;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class SessionController extends Controller{
    function index(){
        return view('admin/login/index');
    }

    function login(Request $request){
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|min:8'
        ]);

        $login_info = [
            'email' => $request->email,
            'password' => $request->password
        ];

        if(Auth::attempt($login_info) && Auth::user()->role === 'admin'){
            $user = user::where('id', Auth::user()->id)->first();;
            $user->last_login = date('Y-m-d H:i:s');
            $user->save();

            return redirect()->route('challenges.index')->with('success', 'Login success');
        }return redirect()->route('session.index')->withErrors('Invalid email or password');
    }

    function logout(){
        Session::forget('user_name');
        Auth::logout();
        return redirect()->route('session.index')->with('success', 'Logout success');
    }
}
