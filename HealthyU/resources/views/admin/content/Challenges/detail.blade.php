@extends('admin/layout/layout') 

@section('content')
    <a href="{{ route('challenges.index') }}" class="btn btn-secondary m-3">&laquo; Back</a>
    <div class="card m-3">
        <div class="card-header">
            <h2>{{ $data->name }}</h2>
        </div>
        <div class="card-body">
            <div class="row">
                <div class="col-md-6">
                    <p>{{ $data->description }}</p>
                    <p><strong>Created at:</strong> {{ $data->created_at }}</p>
                    <p><strong>Updated at:</strong> {{ $data->updated_at }}</p>
                </div>
                <div class="col-md-6">
                    <img src="{{ url('images/' .$data->image ) }}" alt="{{ $data->name }}" class="img-fluid">
                </div>
            </div>
        </div>
    </div>
@endsection