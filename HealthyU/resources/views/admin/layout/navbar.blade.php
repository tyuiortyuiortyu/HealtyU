<nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container-fluid">
        <a class="navbar-brand d-flex align-items-center justify-content-center" href="{{ route('challenges.index') }}">
            <img src="/Logo HealthyU.png" alt="Logo HealthyU" width="50" height="50" class="d-inline-block align-top">
            HealthyU Admin
        </a>
    </div>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarNavDropdown">
        <ul class="navbar-nav">
            <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    Table
                </a>
                <ul class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                    <li><a class="dropdown-item" href="#">Users</a></li>
                    <li><a class="dropdown-item" href="#">Challenges</a></li>
                    <li><a class="dropdown-item" href="#">Challenge Details</a></li>
                    <li><a class="dropdown-item" href="#">Cycle Details</a></li>
                    <li><a class="dropdown-item" href="#">Posts</a></li>
                    <li><a class="dropdown-item" href="#">Comments</a></li>
                    <li><a class="dropdown-item" href="#">Steps</a></li>
                    <li><a class="dropdown-item" href="#">Chat Rooms</a></li>
                    <li><a class="dropdown-item" href="#">Chat Details</a></li>
                    <li><a class="dropdown-item" href="#">Notifications</a></li>
                    <li><a class="dropdown-item" href="#">Medicines</a></li>
                    <li><a class="dropdown-item" href="#">Units</a></li>
                    <li><a class="dropdown-item" href="#">Med Schedules</a></li>
                </ul>
            </li>
        </ul>
    </div>
    <div class="d-flex justify-content-end mx-3">
        <span class="text-white text-end text-truncate">Welcome, {{ session('name') }}</span>
    </div>
    <div class="me-3">
        <a class="btn btn-danger" href="{{ route('session.logout') }}">
            <i class="bi bi-door-open fs-4"></i>
        </a>
    </div>
</nav>

<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet">
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js"></script>

<script>
    document.addEventListener("DOMContentLoaded", function () {
        const dropdownItems = document.querySelectorAll('.dropdown-item');
        const dropdownToggle = document.getElementById('navbarDropdownMenuLink');

        dropdownItems.forEach(item => {
            item.addEventListener('click', function() {
                dropdownToggle.textContent = item.textContent;
            });
        });
    });
</script>


