@extends('admin/layout/layout')

@section('content')
    <table class="table table-striped table-bordered rounded">
        <thead>
            <tr>
                <th style="width: 3%;">ID</th>
                <th style="width: 5%">User ID</th>
                <th style="width: 5%">Unit ID</th>
                <th style="width: 20%;">Medicine Name</th>
                <th style="width: 10%;">Medicine Dose</th>
                <th style="width: 10%;">Food Relation</th>
                <th style="width: 7%">Actions</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($data as $item)
                <tr>
                    <td style="width: 3%;">{{ $item->id }}</td>
                    <td style="width: 5%">{{ $item->user_id }}</td>
                    <td style="width: 5%">{{ $item->unit_id }}</td>
                    <td style="width: 20%;">{{ $item->med_name }}</td>
                    <td style="width: 10%;">{{ $item->med_dose }}</td>
                    <td style="width: 10%;">{{ $item->food_relation }}</td>
                    <td style="width: 7%">
                        <div class="d-flex justify-content-center">
                            <a href='{{ url('/admin/medicines/' .$item->id)}}' class="btn btn-secondary btn-sm me-2">Detail</a>
                            <form method="POST" action="{{ route('medicines.destroy', $item->id)}}" style="display:inline;" onsubmit="return confirmDelete(event)">
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
