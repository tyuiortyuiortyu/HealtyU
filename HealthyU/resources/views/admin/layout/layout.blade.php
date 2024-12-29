<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Raleway:wght@400;600;700&display=swap" rel="stylesheet">
    <title>Admin Menu</title>
</head>
<body>
    <div style="font-family: 'Raleway', sans-serif;">@include('admin/layout/navbar')</div>
    <div class="class py-3 mx-4" style="font-family: 'Raleway', sans-serif;">
        @include('admin/content/message')
        @yield('challenges')
    </div>

    <script>
        function confirmDelete(event) {
            if (!confirm("Are you sure you want to delete this item?")) {
                event.preventDefault();
                return false;
            }
            return true;
        }
    </script>
    <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.6/dist/umd/popper.min.js" integrity="sha384-oBqDVmMz4fnFO9gybBogGzA5Yk5R5Q2z6b6Y6S1r24E6lg6Gm4Gczr6pFiG8Jr8K" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.min.js" integrity="sha384-ho+j7jyWK8fNQe+A12W8+6eY5d2y6b6Y6S1r24E6lg6Gm4Gczr6pFiG8Jr8K" crossorigin="anonymous"></script>
</body>
</html>
