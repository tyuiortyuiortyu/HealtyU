@extends('admin/layout/layout')

@section('content')
    <a href="{{ route('users.create') }}" class="btn btn-primary mb-3 ms-3">+ Add User</a>
    <table class="table table-striped table-bordered rounded">
        <thead>
            <tr>
                <th style="width: 3%;">ID</th>
                <th style="width: 15%;">Name</th>
                <th style="width: 15%;">Username</th>
                <th style="width: 20%;">Email</th>
                <th style="width: 10%;">Role</th>
                <th style="width: 15%;">Last Login</th>
                <th style="width: 10%;">Actions</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($data as $item)
                <tr>
                    <td style="width: 3%;">{{ $item->id }}</td>
                    <td style="width: 15%;">{{ $item->name }}</td>
                    <td style="width: 15%;">{{ $item->username }}</td>
                    <td style="width: 20%;">{{ $item->email }}</td>
                    <td style="width: 10%;">{{ $item->role }}</td>
                    <td style="width: 15%;">{{ $item->last_login }}</td>
                    <td style="width: 10%;">
                        <div class="d-flex justify-content-center">
                            <a href='{{ url('/admin/users/' .$item->id)}}' class="btn btn-secondary btn-sm me-2">Detail</a>
                            <a href='{{ url('/admin/users/' .$item->id. '/edit')}}' class="btn btn-warning btn-sm me-2">Edit</a>
                            <form method="POST" action="{{ route('users.destroy', $item->id)}}" style="display:inline;" onsubmit="return confirmDelete(event)">
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
