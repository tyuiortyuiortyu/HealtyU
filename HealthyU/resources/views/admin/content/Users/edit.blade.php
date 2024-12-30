@extends('admin/layout/layout')

@section('content')
    <div class="container mt-4">
        <a class="btn btn-secondary mb-3" href="{{ route('users.index') }}">&laquo; Back</a>
        <div class="card">
            <div class="card-header">
                <h1>Edit User Data</h1>
            </div>
            <div class="card-body">
                <form method="POST" action="{{ route('users.update', $data->id) }}" enctype="multipart/form-data">
                    @csrf
                    @method('PUT')
                    <div class="row mb-3">
                        <div class="col-md-3 text-right"><b>Name:</b></div>
                        <div class="col-md-9"><input type="text" class="form-control" id="name" name="name" value="{{ $data->name }}"></div>
                    </div>
                    <div class="row mb-3">
                        <div class="col-md-3 text-right"><b>Email:</b></div>
                        <div class="col-md-9"><input type="email" class="form-control" id="email" name="email" value="{{ $data->email }}"></div>
                    </div>
                    <div class="row mb-3">
                        <div class="col-md-3 text-right"><b>Username:</b></div>
                        <div class="col-md-9"><input type="text" class="form-control" id="username" name="username" value="{{ $data->username }}"></div>
                    </div>
                    <div class="row mb-3">
                        <div class="col-md-3 text-right"><b>Password:</b></div>
                        <div class="col-md-9"><input type="text" class="form-control" id="password" name="password" placeholder="Leave blank to keep current password"></div>
                    </div>
                    <div class="row mb-3">
                        <div class="col-md-3 text-right"><b>Date of Birth:</b></div>
                        <div class="col-md-4"><input type="date" class="form-control" id="dob" name="dob" value="{{ $data->dob }}"></div>
                        <div class="col-md-1 text-right"><b>Sex:</b></div>
                        <div class="col-md-4">
                            <select class="form-control" id="sex" name="sex">
                                <option value="male" {{ $data->sex == 'Male' ? 'selected' : '' }}>Male</option>
                                <option value="female" {{ $data->sex == 'Female' ? 'selected' : '' }}>Female</option>
                                <option value="other" {{ $data->sex == 'Other' ? 'selected' : '' }}>Other</option>
                            </select>
                        </div>
                    </div>
                    <div class="row mb-3">
                        <div class="col-md-3 text-right"><b>Weight (kg):</b></div>
                        <div class="col-md-4"><input type="number" step="0.01" class="form-control" id="weight" name="weight" value="{{ $data->weight }}"></div>
                        <div class="col-md-1 text-right"><b>Height (cm):</b></div>
                        <div class="col-md-4"><input type="number" step="0.01" class="form-control" id="height" name="height" value="{{ $data->height }}"></div>
                    </div>
                    <div class="row mb-3">
                        <div class="col-md-3 text-right"><b>Role:</b></div>
                        <div class="col-md-9">
                            <select class="form-control" id="role" name="role">
                                <option value="user" {{ $data->role == 'user' ? 'selected' : '' }}>User</option>
                                <option value="admin" {{ $data->role == 'admin' ? 'selected' : '' }}>Admin</option>
                            </select>
                        </div>
                    </div>
                    <div class="row mb-3">
                        <div class="col-md-9 offset-md-3">
                            <button type="submit" class="btn btn-primary">Save</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
@endsection
