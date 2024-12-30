@extends('admin/layout/layout')

@section('users')
    <div class="container mt-4">
        <a href="{{ route('users.index') }}" class="btn btn-secondary mb-3">&laquo; Back</a>
        <div class="container mt-4">
            <div class="card">
                <div class="card-header">
                    <h1>Add New User</h1>
                </div>
                <div class="card-body">
                    <form method="POST" action="{{ route('users.store') }}" class="form-inline" enctype="multipart/form-data">
                        @csrf
                        <div class="mb-3 row">
                            <label for="name" class="col-sm-2 col-form-label">Name</label>
                            <div class="col-sm-10">
                                <input type="text" class="form-control" id="name" name="name" value="{{ old('name') }}">
                            </div>
                        </div>
                        <div class="mb-3 row">
                            <label for="email" class="col-sm-2 col-form-label">Email</label>
                            <div class="col-sm-10">
                                <input type="email" class="form-control" id="email" name="email" value="{{ old('email') }}">
                            </div>
                        </div>
                        <div class="mb-3 row">
                            <label for="username" class="col-sm-2 col-form-label">Username</label>
                            <div class="col-sm-10">
                                <input type="text" class="form-control" id="username" name="username" value="{{ old('username') }}">
                            </div>
                        </div>
                        <div class="mb-3 row">
                            <label for="password" class="col-sm-2 col-form-label">Password</label>
                            <div class="col-sm-10">
                                <input type="password" class="form-control" id="password" name="password" value="{{ old('password') }}">
                            </div>
                        </div>
                        <div class="mb-3 row">
                            <label for="dob" class="col-sm-2 col-form-label">Date of Birth</label>
                            <div class="col-sm-4">
                                <input type="date" class="form-control" id="dob" name="dob" value="{{ old('dob') }}">
                            </div>
                            <label for="sex" class="col-sm-2 col-form-label">Gender</label>
                            <div class="col-sm-4">
                                <select class="form-control" id="sex" name="sex">
                                    <option value="male" {{ old('sex') == 'Male' ? 'selected' : '' }}>Male</option>
                                    <option value="female" {{ old('sex') == 'Female' ? 'selected' : '' }}>Female</option>
                                    <option value="other" {{ old('sex') == 'Other' ? 'selected' : '' }}>Other</option>
                                </select>
                            </div>
                        </div>
                        <div class="mb-3 row">
                            <label for="weight" class="col-sm-2 col-form-label">Weight (kg)</label>
                            <div class="col-sm-4">
                                <input type="number" step="0.01" class="form-control" id="weight" name="weight" value="{{ old('weight') }}">
                            </div>
                            <label for="height" class="col-sm-2 col-form-label">Height (cm)</label>
                            <div class="col-sm-4">
                                <input type="number" step="0.01" class="form-control" id="height" name="height" value="{{ old('height') }}">
                            </div>
                        </div>
                        <div class="mb-3 row">
                            <label for="role" class="col-sm-2 col-form-label">Role</label>
                            <div class="col-sm-10">
                                <select class="form-control" id="role" name="role">
                                    <option value="user" {{ old('role') == 'user' ? 'selected' : '' }}>User</option>
                                    <option value="admin" {{ old('role') == 'admin' ? 'selected' : '' }}>Admin</option>
                                </select>
                            </div>
                        </div>
                        <div class="mb-3 row">
                            <div class="col-sm-10 offset-sm-2">
                                <button type="submit" class="btn btn-primary">Save</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
@endsection
