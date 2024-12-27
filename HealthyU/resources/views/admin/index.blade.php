@extends('admin/layout')

@section('challenges')
    <a href="challenges/create" class="btn btn-primary mb-3 ms-3">+ Add Challenge</a>
    <table class="table table-striped table-bordered">
        <thead>
            <tr>
                <th>ID</th>
                <th style="width: 15%">Challenge Name</th>
                <th>Description</th>
                <th style="width: 10%;">Image</th>
                <th style="width: 12.5%;">Created At</th>
                <th style="width: 12.5%;">Updated At</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($data as $item)
                <tr>
                    <td>{{ $item->id }}</td>
                    <td style="width: 15%">{{ $item->name }}</td>
                    <td>{{ $item->description }}</td>
                    <td style="width: 10%;">{{ $item->image }}</td>
                    <td style="width: 12.5%;">{{ $item->created_at }}</td>
                    <td style="width: 12.5%;">{{ $item->updated_at }}</td>
                    <td>
                        <div class="d-flex">
                            <a href="#" class="btn btn-secondary btn-sm me-2">Detail</a>
                            <a href='{{ url('/admin/challenges/' .$item->id. '/edit')}}' class="btn btn-warning btn-sm me-2">Edit</a>
                            <form action="{{ route('challenges.destroy', $item->id)}}" method="POST" style="display:inline;" onsubmit="return confirmDelete(event)">
                                @csrf
                                @method('DELETE')
                                <button type="submit" class="btn btn-danger btn-sm">Delete</button>
                            </form>
                        </div>
                    </td>
                </tr>
            @endforeach
        </tbody>
    </table>
    {{ $data->links() }}
@endsection
