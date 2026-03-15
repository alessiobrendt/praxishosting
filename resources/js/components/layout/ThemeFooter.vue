<script setup lang="ts">
import { Link } from '@inertiajs/vue3';

const currentYear = new Date().getFullYear();
</script>

<template>
    <footer class="footer theme-footer mt-auto border-t border-default-200/80 bg-card py-5 dark:border-default-700/50">
        <div class="container-fluid">
            <div class="flex flex-col items-center justify-between gap-4 sm:flex-row sm:gap-6">
                <div class="flex flex-col items-center gap-1 text-center sm:flex-row sm:items-center sm:text-left">
                    <span class="text-sm text-default-600 dark:text-default-400">
                        © {{ currentYear }}
                        <span class="font-semibold text-default-800 dark:text-default-200">Praxishosting</span>
                    </span>
                    <span class="hidden text-default-400 sm:inline" aria-hidden="true">·</span>
                    <span class="text-xs text-default-500 dark:text-default-500">Alle Rechte vorbehalten.</span>
                </div>
                <nav
                    class="flex flex-wrap items-center justify-center gap-x-6 gap-y-1 text-sm"
                    aria-label="Footer-Links"
                >
                    <Link
                        href="/impressum"
                        class="text-default-600 transition-colors hover:text-primary dark:text-default-400 dark:hover:text-primary-400"
                    >
                        Impressum
                    </Link>
                    <Link
                        href="/agb"
                        class="text-default-600 transition-colors hover:text-primary dark:text-default-400 dark:hover:text-primary-400"
                    >
                        AGB
                    </Link>
                    <Link
                        href="/datenschutz"
                        class="text-default-600 transition-colors hover:text-primary dark:text-default-400 dark:hover:text-primary-400"
                    >
                        Datenschutz
                    </Link>
                </nav>
            </div>
        </div>
    </footer>
</template>
