<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\users;

class UserController extends Controller
{
    //
    function index(){
        $data = users::orderBy('id','asc')->paginate(2);
        return view('users/menuAdmin_users')->with('data',$data);
    }

    function detail($id){
        $data = users::where('id',$id)->first();
        return view('users/detail')->with('data',$data);
    }
}
