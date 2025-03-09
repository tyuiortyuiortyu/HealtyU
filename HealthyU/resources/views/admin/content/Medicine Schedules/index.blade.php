@extends('admin/layout/layout')

@section('content')
    <table class="table table-striped table-bordered rounded">
        <thead>
            <tr>
                <th style="width: 3%;">ID</th>
                <th style="width: 5%">Med ID</th>
                <th style="width: 10%">Time To Take</th>
                <th style="width: 10%">Mon</th>
                <th style="width: 10%">Tue</th>
                <th style="width: 10%">Wed</th>
                <th style="width: 10%">Thu</th>
                <th style="width: 10%">Fri</th>
                <th style="width: 10%">Sat</th>
                <th style="width: 10%">Sun</th>
                <th style="width: 7%">Actions</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($data as $item)
                <tr>
                    <td style="width: 3%;">{{ $item->id }}</td>
                    <td style="width: 5%">{{ $item->med_id }}</td>
                    <td style="width: 10%">{{ $item->time_to_take }}</td>
                    <td style="width: 10%;">{!! $item->monday ? '&#10003;' : '-' !!}</td>
                    <td style="width: 10%;">{!! $item->tuesday ? '&#10003;' : '-' !!}</td>
                    <td style="width: 10%;">{!! $item->wednesday ? '&#10003;' : '-' !!}</td>
                    <td style="width: 10%;">{!! $item->thursday ? '&#10003;' : '-' !!}</td>
                    <td style="width: 10%;">{!! $item->friday ? '&#10003;' : '-' !!}</td>
                    <td style="width: 10%;">{!! $item->saturday ? '&#10003;' : '-' !!}</td>
                    <td style="width: 10%;">{!! $item->sunday ? '&#10003;' : '-' !!}</td>
                    <td style="width: 7%">
                        <div class="d-flex justify-content-center">
                            <a href='{{ url('/admin/medSchedules/' .$item->id)}}' class="btn btn-secondary btn-sm me-2">Detail</a>
                            <form method="POST" action="{{ route('medSchedules.destroy', $item->id)}}" style="display:inline;" onsubmit="return confirmDelete(event)">
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
