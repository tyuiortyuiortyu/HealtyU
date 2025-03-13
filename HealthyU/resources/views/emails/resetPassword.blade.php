<!DOCTYPE html>
<html>
<head>
    <title>Reset Password</title>
</head>
<body>
    <p>Hai,</p>
    <p>Klik link berikut untuk mereset password Anda:</p>
    <a href="{{ url('/reset-password?token=' . $token) }}">Reset Password</a>
    <p>Jika Anda tidak meminta reset, abaikan email ini.</p>
</body>
</html>
