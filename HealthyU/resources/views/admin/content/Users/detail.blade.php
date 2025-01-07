@extends('admin/layout/layout') 

@section('content')
    <div class="container mt-4">
        <a class="btn btn-secondary mb-3" href="{{ route('users.index') }}">&laquo; Back</a>
        <div class="card">
            <div class="card-header">
                <h1>User Information</h1>
            </div>
            <div class="card-body">
                <div class="row">
                    <div class="col-md-3 text-right"><b>ID:</b></div>
                    <div class="col-md-9">{{ $data->id }}</div>
                </div>
                <div class="row">
                    <div class="col-md-3 text-right"><b>Name:</b></div>
                    <div class="col-md-9">{{ $data->name }}</div>
                </div>
                <div class="row">
                    <div class="col-md-3 text-right"><b>Email:</b></div>
                    <div class="col-md-9">{{ $data->email }}</div>
                </div>
                <div class="row">
                    <div class="col-md-3 text-right"><b>Email verified at:</b></div>
                    <div class="col-md-9">{{ $data->email_verified_at }}</div>
                </div>
                <div class="row">
                    <div class="col-md-3 text-right"><b>Last Login:</b></div>
                    <div class="col-md-9">{{ $data->last_login }}</div>
                </div>
                <div class="row">
                    <div class="col-md-3 text-right"><b>Username:</b></div>
                    <div class="col-md-9">{{ $data->username }}</div>
                </div>
                <div class="row">
                    <div class="col-md-3 text-right"><b>Password:</b></div>
                    <div class="col-md-9">{{ $data->password }}</div>
                </div>
                <div class="row">
                    <div class="col-md-3 text-right"><b>Date of Birth:</b></div>
                    <div class="col-md-9">{{ $data->dob }}</div>
                </div>
                <div class="row">
                    <div class="col-md-3 text-right"><b>Sex:</b></div>
                    <div class="col-md-9">{{ $data->sex }}</div>
                </div>
                <div class="row">
                    <div class="col-md-3 text-right"><b>Weight:</b></div>
                    <div class="col-md-9">{{ $data->weight }}</div>
                </div>
                <div class="row">
                    <div class="col-md-3 text-right"><b>Height:</b></div>
                    <div class="col-md-9">{{ $data->height }}</div>
                </div>
                <div class="row">
                    <div class="col-md-3 text-right"><b>Role:</b></div>
                    <div class="col-md-9">{{ $data->role }}</div>
                </div>
                <div class="row">
                    <div class="col-md-3 text-right"><b>Created at:</b></div>
                    <div class="col-md-9">{{ $data->created_at }}</div>
                </div>
                <div class="row">
                    <div class="col-md-3 text-right"><b>Updated at:</b></div>
                    <div class="col-md-9">{{ $data->updated_at }}</div>
                </div>
            </div>
        </div>
    </div>
@endsection