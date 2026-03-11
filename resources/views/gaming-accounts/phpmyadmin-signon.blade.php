<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Weiterleitung zu phpMyAdmin</title>
    <style>
        body { font-family: system-ui, sans-serif; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; }
        p { color: #666; }
    </style>
</head>
<body>
    <p>Weiterleitung zu phpMyAdmin …</p>
    <form id="pmaform" action="{{ $phpmyadmin_url }}/index.php" method="post" target="_blank">
        <input type="hidden" name="server" value="{{ $host }}">
        <input type="hidden" name="pma_username" value="{{ $username }}">
        <input type="hidden" name="pma_password" value="{{ $password }}">
    </form>
    <script>
        document.getElementById('pmaform').submit();
    </script>
</body>
</html>
