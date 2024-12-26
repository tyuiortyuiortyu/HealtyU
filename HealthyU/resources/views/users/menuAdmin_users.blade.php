@extends('layout/aplikasi')

@section('detail')
    <table class="table">
        <thead>
            <tr>
                <th>id</th>
                <th>Name</th>
                <th>Username</th>
                <th>Email</th>
                <th>Role</th>
                <th>Action</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($data as $item)
                <tr>
                    <td>{{ $item->id }}</td>
                    <td>{{ $item->name }}</td>
                    <td>{{ $item->username }}</td>
                    <td>{{ $item->email }}</td>
                    <td>{{ $item->role }}</td>
                    <td><a class='btn btn-secondary btn-sm' href='{{ url('/menu-admin/user/detail/'.$item->id) }}'>Detail</a></td>
                </tr>
            @endforeach
        </tbody>
    </table>
    {{ $data->links() }}
@endsection