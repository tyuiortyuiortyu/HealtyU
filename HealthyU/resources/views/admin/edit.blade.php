@extends('admin/layout')

@section('challenges')
    <a href="{{ route('challenges.index') }}" class="btn btn-secondary ms-3"><- Back</a>
    <div class="container mt-5">
        <div class="row justify-content-center">
            <div class="col-md-8">
                <div class="card">
                    <div class="card-header">Edit Challenge</div>
                    <div class="card-body">
                        <form method="POST" action="{{ route('challenges.update', $data->id) }}">
                            @csrf
                            @method('PUT')
                            <div class="mb-3 row">
                                <label for="id" class="col-sm-2 col-form-label">ID</label>
                                <div class="col-sm-10">
                                    <input type="text" class="form-control" id="id" name="id" value="{{ $data->id }}" readonly>
                                </div>
                            </div>
                            <div class="mb-3 row">
                                <label for="name" class="col-sm-2 col-form-label">Name</label>
                                <div class="col-sm-10">
                                    <input type="text" class="form-control" id="name" name="name" value="{{ $data->name }}">
                                </div>
                            </div>
                            <div class="mb-3 row">
                                <label for="description" class="col-sm-2 col-form-label">Description</label>
                                <div class="col-sm-10">
                                    <textarea class="form-control" name="description" rows="3" cols="30">{{ $data->description }}</textarea>
                                </div>
                            </div>
                            <div class="mb-3 row">
                                <label for="image" class="col-sm-2 col-form-label">Image</label>
                                <div class="col-sm-10">
                                    <input type="text" class="form-control" id="image" name="image" value="{{ $data->image }}">
                                </div>
                            </div>
                            <div class="mb-3 row">
                                <label for="created_at" class="col-sm-2 col-form-label">Created At</label>
                                <div class="col-sm-10">
                                    <input type="text" class="form-control" id="created_at" name="created_at" value="{{ $data->created_at }}" readonly>
                                </div>
                            </div>
                            <div class="mb-3 row">
                                <label for="created_at" class="col-sm-2 col-form-label">Updated At</label>
                                <div class="col-sm-10">
                                    <input type="text" class="form-control" id="updated_at" name="updated_at" value="{{ $data->updated_at }}" readonly>
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
    </div>
@endsection