@extends('layout/aplikasi')

@section('detail')
    <div>
        <a class='btn btn-secondary' href='/menu-admin/user'><< Back</a>
        <h1>Detail Information</h1>
        <p><b>ID: </b>{{ $data->id }}</p>
        <p><b>Name: </b>{{ $data->name }}</p>
        <p><b>Email: </b>{{ $data->email }}</p>
        <p><b>Email verified at: </b>{{ $data->email_verified_at }}</p>
        <p><b>Username: </b>{{ $data->username }}</p>
        <p><b>Password: </b>{{ $data->password }}</p>
        <p><b>Date of Birth: </b>{{ $data->dob }}</p>
        <p><b>Sex: </b>{{ $data->sex }}</p>
        <p><b>Weight: </b>{{ $data->wight }}</p>
        <p><b>Height: </b>{{ $data->height }}</p>
        <p><b>Role: </b>{{ $data->role }}</p>
        <p><b>Created at: </b>{{ $data->created_at }}</p>
        <p><b>Updated at: </b>{{ $data->updated_at }}</p>
    </div>
@endsection