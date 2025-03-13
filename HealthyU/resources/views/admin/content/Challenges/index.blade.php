@extends('admin/layout/layout')

@section('content')
    <a href="{{ route('challenges.create') }}" class="btn btn-primary mb-3 ms-3">+ Add Challenge</a>
    <table class="table table-striped table-bordered rounded">
        <thead>
            <tr>
                <th style="width: 3%;">ID</th>
                <th style="width: 15%">Challenge Name</th>
                <th style="width: 40%">Description</th>
                <th style="width: 5%;">Image</th>
                <th style="width: 12.5%;">Created At</th>
                <th style="width: 12.5%;">Updated At</th>
                <th style="width: 7%">Actions</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($data as $item)
                <tr>
                    <td style="width: 3%;">{{ $item->id }}</td>
                    <td style="width: 15%">{{ $item->name }}</td>
                    <td style="width: 40%">{{ $item->description }}</td>
                    <td style="width: 5%;">{{ $item->image }}</td>
                    <td style="width: 12.5%;">{{ $item->created_at }}</td>
                    <td style="width: 12.5%;">{{ $item->updated_at }}</td>
                    <td style="width: 7%">
                        <div class="d-flex justify-content-center">
                            <a href='{{ url('/admin/challenges/' .$item->id)}}' class="btn btn-secondary btn-sm me-2">Detail</a>
                            <a href='{{ url('/admin/challenges/' .$item->id. '/edit')}}' class="btn btn-warning btn-sm me-2">Edit</a>
                            <form method="POST" action="{{ route('challenges.destroy', $item->id)}}" style="display:inline;" onsubmit="return confirmDelete(event)">
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
