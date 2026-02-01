<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>@yield('title', config('app.name'))</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        primary: { DEFAULT: '#059669', light: '#10b981', dark: '#047857' },
                    },
                },
            },
        };
    </script>
    <style>
        .gradient-primary { background: linear-gradient(135deg, hsl(142 76% 36%) 0%, hsl(142 76% 42%) 100%); }
    </style>
</head>
<body class="bg-gray-50 text-gray-800 text-sm antialiased" style="background-color: #f9fafb;">
    <div class="py-8 px-4">
        <div class="max-w-xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden" style="box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);">
            <div class="px-8 py-8">
                @yield('content')
            </div>
        </div>
    </div>
</body>
</html>
