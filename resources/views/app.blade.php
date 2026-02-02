<!DOCTYPE html>
@php
    $appearance = $appearance ?? 'system';
@endphp
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" data-appearance="{{ $appearance }}" class="{{ $appearance === 'dark' ? 'dark' : '' }}">
    <head>
        <script>
            if (document.documentElement.dataset.appearance === 'light') {
                document.documentElement.classList.remove('dark');
            }
        </script>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        {{-- Inline script to detect system dark mode preference and apply it immediately --}}
        <script>
            (function() {
                const appearance = '{{ $appearance }}';

                if (appearance === 'system') {
                    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

                    if (prefersDark) {
                        document.documentElement.classList.add('dark');
                    }
                }
            })();
        </script>

        {{-- Inline style to set the HTML background color based on our theme in app.css --}}
        <style>
            html {
                background-color: oklch(1 0 0);
            }

            html.dark {
                background-color: oklch(0.145 0 0);
            }

            {{-- Force light mode when data-appearance="light" (e.g. site-render) - overrides .dark --}}
            html[data-appearance="light"],
            html[data-appearance="light"].dark {
                --background: hsl(0 0% 100%);
                --foreground: hsl(0 0% 3.9%);
                --card: hsl(0 0% 100%);
                --card-foreground: hsl(0 0% 3.9%);
                --popover: hsl(0 0% 100%);
                --popover-foreground: hsl(0 0% 3.9%);
                --secondary: hsl(0 0% 96.1%);
                --secondary-foreground: hsl(0 0% 9%);
                --muted: hsl(0 0% 96.1%);
                --muted-foreground: hsl(0 0% 45.1%);
                --border: hsl(0 0% 89.2%);
                --input: hsl(0 0% 89.2%);
                background-color: oklch(1 0 0) !important;
                color-scheme: light;
            }
        </style>

        <title inertia>{{ config('app.name', 'Laravel') }}</title>

        <link rel="icon" href="/favicon.ico" sizes="any">
        <link rel="icon" href="/favicon.svg" type="image/svg+xml">
        <link rel="apple-touch-icon" href="/apple-touch-icon.png">

        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />

        @vite(['resources/js/app.ts', "resources/js/pages/{$page['component']}.vue"])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia
        <div id="toast-portal" aria-live="polite"></div>
    </body>
</html>
