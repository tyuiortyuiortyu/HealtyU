@extends('admin/layout')

@section('challenges')
    <style>
        th, td {
            white-space: nowrap;
        }
        .table {
            table-layout: fixed;
            width: 100%;
        }
        .table th, .table td {
            overflow: hidden;
            text-overflow: ellipsis;
        }
    </style>
    <table class="table">
        <thead>
            <tr>
                <th style="width: 3%;">ID</th>
                <th style="width: 15%;">Challenge Name</th>
                <th style="width: 35%;">Description</th>
                <th style="width: 15%;">Image</th>
                <th style="width: 10%;">Created At</th>
                <th style="width: 10%;">Updated At</th>
                <th style="width: 12%;">Actions</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($data as $item)
                <tr>
                    <td style="width: 3%;">{{ $item->id }}</td>
                    <td style="width: 15%;">{{ $item->name }}</td>
                    <td style="width: 35%;">{{ $item->description }}</td>
                    <td style="width: 15%;">{{ $item->image }}</td>
                    <td style="width: 10%;">{{ $item->created_at }}</td>
                    <td style="width: 10%;">{{ $item->updated_at }}</td>
                    <td style="width: 12%;">
                        <a href="#" class="btn btn-secondary btn-sm">Detail</a>
                        <a href="#" class="btn btn-warning btn-sm">Edit</a>
                        <form action="{{ route('challenges.destroy', $item->id)}}" method="POST" style="display:inline;" onsubmit="return confirmDelete(event)">
                            @csrf
                            @method('DELETE')
                            <button type="submit" class="btn btn-danger btn-sm">Delete</button>
                        </form>
                    </td>
                </tr>
            @endforeach
        </tbody>
    </table>
    {{ $data->links() }}
@endsection
