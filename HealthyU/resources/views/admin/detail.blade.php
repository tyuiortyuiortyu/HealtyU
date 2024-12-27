@extends('admin/layout') 

@section('challenges')
    <div class="row">
        <div class="col-md-6">
            <h2>{{ $data->name }}</h2>
            <p>{{ $data->description }}</p>
            <p><strong>Created at:</strong> {{ $data->created_at }}</p>
            <p><strong>Updated at:</strong> {{ $data->updated_at }}</p>
        </div>
        <div class="col-md-6">
            <img src="{{ url('images/' .$data->image ) }}" alt="{{ $data->name }}" class="img-fluid">
        </div>
    </div>
@endsection