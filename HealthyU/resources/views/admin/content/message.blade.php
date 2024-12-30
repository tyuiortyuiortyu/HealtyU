@if ($errors->any())
    <div class="alert alert-danger" id="error-alert">
        <ul>
            @foreach ($errors->all() as $error)
                <li>{{ $error }}</li>
            @endforeach
        </ul>
    </div>
@endif

@if (Session::get('success'))
    <div class="alert alert-success" id="success-alert">
        {{ Session::get('success') }}
    </div>
@endif




<style>
    .fade-out {
        opacity: 0;
        transition: opacity 1s ease-out;
    }
</style>

<script>
    setTimeout(() => {
        const errorAlert=document.getElementById('error-alert');
        if(errorAlert){
            errorAlert.classList.add('fade-out');
            setTimeout(() => {
                errorAlert.style.display='none';
            }, 500);
        }
    }, 5000);

    setTimeout(() => {
        const successAlert=document.getElementById('success-alert');
        if(successAlert){
            successAlert.classList.add('fade-out');
            setTimeout(() => {
                successAlert.style.display='none';
            }, 500);
        }
    }, 5000);
</script>