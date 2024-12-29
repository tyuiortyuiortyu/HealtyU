@extends('admin/layout/layoutLogin')

@section('login')

    <div class="bg-light d-flex justify-content-center flex-column align-items-center overflow-hidden" style="min-height: 100vh;">
        <div class="card shadow-lg p-5" style="width: 100%; max-width: 450px; border-radius: 20px;">
            <div class="d-flex flex-row justify-content-center align-items-center mb-4" style="height: 60px;">
                <img src="/Logo HealthyU.png" alt="Logo HealthyU" width="60" height="60" class="me-2">
                <h3 class="text-center mb-0" style="font-family: 'Raleway', sans-serif; line-height: 60px;">Login</h3>
            </div>
            <form method="POST" action="{{ route('session.login') }}" style="font-family: 'Raleway', sans-serif;">
                @csrf
                <div class="mb-3">
                    <label for="email" class="form-label">Email</label>
                    <input type="email" class="form-control input-small" id="email" name="email" value="{{ Session::get('email') }}" placeholder="Enter your email">
                </div>
                <div class="mb-3">
                    <label for="password" class="form-label">Password</label>
                    <input type="password" class="form-control input-small" id="password" name="password" placeholder="Enter your password">
                </div>
                <div class="d-grid">
                    <button type="submit" class="btn btn-primary">Login</button>
                </div>
            </form>
        </div>
    </div>
        
@endsection