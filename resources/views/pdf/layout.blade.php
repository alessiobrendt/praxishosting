@php
    $pdfPrimary = $primary_color ?? '#059669';
    $pdfPrimaryHover = $primary_hover_color ?? '#047857';
    $pdfHex = ltrim($pdfPrimary, '#');
    $pdfRgb = strlen($pdfHex) === 6 ? implode(', ', array_map('hexdec', str_split($pdfHex, 2))) : '5, 150, 105';
@endphp
<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>@yield('title', 'Dokument')</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        panel: { DEFAULT: '#f9fafb', dark: '#030712' },
                        primary: { DEFAULT: '{{ $pdfPrimary }}', light: '{{ $pdfPrimaryHover }}', dark: '{{ $pdfPrimaryHover }}' },
                    },
                },
            },
        };
    </script>
    <style>
        .gradient-primary { background: linear-gradient(135deg, {{ $pdfPrimary }} 0%, {{ $pdfPrimaryHover }} 100%); }
        .border-primary { border-color: {{ $pdfPrimary }} !important; }
        .text-primary { color: {{ $pdfPrimary }} !important; }
        .bg-primary\/5 { background-color: rgba({{ $pdfRgb }}, 0.05) !important; }
    </style>
</head>
<body class="bg-gray-50 text-gray-800 text-sm antialiased" style="background-color: #f9fafb;">
    <div class="min-h-screen py-10 px-6">
        <div class="max-w-3xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden" style="box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);">
            <div class="px-8 py-10">
                @yield('content')
            </div>
        </div>
    </div>
</body>
</html>
