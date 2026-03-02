@php
    $primary = $primaryColor ?? '#059669';
    $primaryHover = $primaryHoverColor ?? '#047857';
    $primaryRgb = $primaryRgb ?? '5, 150, 105';
@endphp
<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>@yield('title', config('app.name'))</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        :root {
            --invoice-primary: {{ $primary }};
            --invoice-primary-hover: {{ $primaryHover }};
        }
        .invoice-gradient-primary { background: linear-gradient(135deg, var(--invoice-primary) 0%, var(--invoice-primary-hover) 100%); }
        .invoice-border-primary { border-color: var(--invoice-primary); }
        .invoice-bg-primary\/5 { background-color: rgba({{ $primaryRgb }}, 0.05); }
        .invoice-text-primary { color: var(--invoice-primary); }
        .invoice-dropdown:focus-within .invoice-dropdown-menu { display: block; }
    </style>
</head>
<body class="bg-gray-50 text-gray-800 text-sm antialiased" style="background-color: #f9fafb;">
    <div class="py-8 px-4">
        <div class="max-w-3xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden" style="box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);">
            <div class="px-8 py-8">
                @yield('content')
            </div>
        </div>
    </div>
</body>
</html>
