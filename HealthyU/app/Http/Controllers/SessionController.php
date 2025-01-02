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
            $user = Auth::user(); 
            session(['user_name' => $user->name]);
            return redirect('/admin/challenges')->with('success', 'Login success');
        }return redirect('/session')->withErrors('Invalid email or password');
    }

    function logout(){
        Session::forget('user_name');
        Auth::logout();
        return redirect('/session')->with('success', 'Logout success');
    }
}
