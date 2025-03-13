@extends('admin/layout/layout') 

@section('content')
    <div class="container mt-4">
        <a class="btn btn-secondary mb-3" href="{{ route('medicines.index') }}">&laquo; Back</a>
        <div class="card">
            <div class="card-header">
                <h1>Medicine Information</h1>
            </div>
            <div class="card-body">
                <div class="row">
                    <div class="col-md-3 text-right"><b>ID:</b></div>
                    <div class="col-md-9">{{ $data->id }}</div>
                </div>
                <div class="row">
                    <div class="col-md-3 text-right"><b>User ID:</b></div>
                    <div class="col-md-9">{{ $data->user_id }}</div>
                </div>
                <div class="row">
                    <div class="col-md-3 text-right"><b>Unit ID:</b></div>
                    <div class="col-md-9">{{ $data->unit_id }}</div>
                </div>
                <div class="row">
                    <div class="col-md-3 text-right"><b>Medicine Name:</b></div>
                    <div class="col-md-9">{{ $data->med_name }}</div>
                </div>
                <div class="row">
                    <div class="col-md-3 text-right"><b>Medicine Dose:</b></div>
                    <div class="col-md-9">{{ $data->med_dose }}</div>
                </div>
                <div class="row">
                    <div class="col-md-3 text-right"><b>Food Relation:</b></div>
                    <div class="col-md-9">{{ $data->food_relation }}</div>
                </div>
                <div class="row">
                    <div class="col-md-3 text-right"><b>Duration:</b></div>
                    <div class="col-md-9">{{ $data->duration }}</div>
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