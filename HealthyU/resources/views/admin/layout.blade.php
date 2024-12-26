<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
    <title>Admin</title>
</head>
<body>
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
        <div class="container-fluid">
            <a class="navbar-brand d-flex align-items-center justify-content-center" href="#">
                <img src="img/Logo HealthyU.png" alt="Logo HealthyU" width="50" height="50" class="d-inline-block align-top">
                HealthyU Admin
            </a>
            <div class="collapse navbar-collapse justify-content-end">
                <span class="navbar-text">
                    {{-- Welcome, {{ $adminName }} --}}
                </span>
            </div>
        </div>
    </nav>
    <div class="d-flex justify-content-between align-items-center my-4">
        <div class="dropdown">
            <button class="btn btn-secondary dropdown-toggle" type="button" id="tableDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                Select Table
            </button>
            <ul class="dropdown-menu" aria-labelledby="tableDropdown">
                <li><a class="dropdown-item" href="#">Challenges</a></li>
                <li><a class="dropdown-item" href="#">Users</a></li>
                <li><a class="dropdown-item" href="#">Medicines</a></li>
            </ul>
        </div>
    </div>
    <div class="class py-5">
        @yield('challenges')
    </div>

    <script>
        function confirmDelete(event) {
            if (!confirm("Are you sure you want to delete this item?")) {
                event.preventDefault(); // Cancel the action if admin does not confirm
                return false;
            }
            return true; // Continue the action if admin confirms
        }
    </script>
    <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.6/dist/umd/popper.min.js" integrity="sha384-oBqDVmMz4fnFO9gybBogGzA5Yk5R5Q2z6b6Y6S1r24E6lg6Gm4Gczr6pFiG8Jr8K" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.min.js" integrity="sha384-ho+j7jyWK8fNQe+A12W8+6eY5d2y6b6Y6S1r24E6lg6Gm4Gczr6pFiG8Jr8K" crossorigin="anonymous"></script>
</body>
</html>
