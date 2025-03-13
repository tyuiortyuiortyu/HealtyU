@extends('admin/layout/layout') 

@section('content')
    <div class="container mt-4">
        <a class="btn btn-secondary mb-3" href="{{ route('medSchedules.index') }}">&laquo; Back</a>
        <div class="card">
            <div class="card-header">
                <h1>Medicine Schedule Information</h1>
            </div>
            <div class="card-body">
                <div class="row">
                    <div class="col-md-3 text-right"><b>ID:</b></div>
                    <div class="col-md-9">{{ $data->id }}</div>
                </div>
                <div class="row">
                    <div class="col-md-3 text-right"><b>Medicine ID:</b></div>
                    <div class="col-md-9">{{ $data->med_id }}</div>
                </div>
                <div class="row">
                    <div class="col-md-3 text-right"><b>Time To Take:</b></div>
                    <div class="col-md-9">{{ $data->time_to_take }}</div>
                </div>
                <div class="row">
                    <div class="col-md-3 text-right"><b>Days To Take:</b></div>
                    <div class="col-md-9">
                        <table class="table table-bordered">
                            <thead>
                                <tr>
                                    <th>Monday</th>
                                    <th>Tuesday</th>
                                    <th>Wednesday</th>
                                    <th>Thursday</th>
                                    <th>Friday</th>
                                    <th>Saturday</th>
                                    <th>Sunday</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>{{ $data->monday ? '✔' : '-' }}</td>
                                    <td>{{ $data->tuesday ? '✔' : '-' }}</td>
                                    <td>{{ $data->wednesday ? '✔' : '-' }}</td>
                                    <td>{{ $data->thursday ? '✔' : '-' }}</td>
                                    <td>{{ $data->friday ? '✔' : '-' }}</td>
                                    <td>{{ $data->saturday ? '✔' : '-' }}</td>
                                    <td>{{ $data->sunday ? '✔' : '-' }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
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