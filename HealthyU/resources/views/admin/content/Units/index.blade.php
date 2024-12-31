@extends('admin/layout/layout')

@section('content')
    <a href="{{ route('units.create') }}" class="btn btn-primary mb-3 ms-3">+ Add Unit</a>
    <table class="table table-striped table-bordered rounded">
        <thead>
            <tr>
                <th style="width: 3%;">ID</th>
                <th style="width: 87%;">Name</th>
                <th style="width: 7%">Actions</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($data as $item)
                <tr>
                    <td style="width: 3%;">{{ $item->id }}</td>
                    <td style="width: 87%;">{{ $item->name }}</td>
                    <td style="width: 7%">
                        <div class="d-flex justify-content-center">
                            <form method="POST" action="{{ route('units.destroy', $item->id)}}" style="display:inline;" onsubmit="return confirmDelete(event)">
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
