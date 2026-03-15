<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Weiterleitung zu phpMyAdmin</title>
    <style>
        body { font-family: system-ui, sans-serif; display: flex; flex-direction: column; justify-content: center; align-items: center; min-height: 100vh; margin: 0; }
        p { color: #666; }
        .hint { margin-top: 1rem; padding: 0.75rem 1rem; background: #fef3c7; border-radius: 0.5rem; font-size: 0.875rem; max-width: 28rem; }
    </style>
</head>
<body>
    <p>Weiterleitung zu phpMyAdmin …</p>
    <form id="pmaform" action="{{ $phpmyadmin_url }}/index.php" method="post" target="_blank">
        <input type="hidden" name="server" value="{{ $server_index }}">
        <input type="hidden" name="pma_username" value="{{ $username }}">
        <input type="hidden" name="pma_password" value="{{ $password }}">
    </form>
    @if(!empty($signon_hint))
    <p class="hint">Der direkte Login funktioniert mit neueren phpMyAdmin-Versionen oft nicht. Für zuverlässigen automatischen Login: <strong>PHPMYADMIN_SIGNON_URL</strong> in .env setzen und das Signon-Skript auf dem phpMyAdmin-Server einrichten (siehe docs/phpmyadmin-signon.md).</p>
    @endif
    <script>
        document.getElementById('pmaform').submit();
    </script>
</body>
</html>
