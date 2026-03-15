<script setup lang="ts">
defineProps<{
    pageData: Record<string, unknown>;
    colors: Record<string, string>;
    generalInformation?: Record<string, unknown>;
    site: { id: number; name: string; slug: string };
}>();
</script>

<template>
    <div class="flex min-h-screen flex-col bg-stone-50">
        <header
            class="sticky top-0 z-10 border-b-2 shadow-md"
            :style="{ backgroundColor: colors.primaryDark ?? '#134e4a', borderColor: colors.primary ?? '#0d9488' }"
        >
            <div class="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6 @sm:px-6">
                <a
                    href="#"
                    class="text-lg font-bold uppercase tracking-wider text-white transition-opacity hover:opacity-90"
                >
                    {{ (generalInformation?.name as string) ?? site.name }}
                </a>
                <nav class="flex items-center gap-4 sm:gap-6 @sm:gap-6" aria-label="Hauptnavigation">
                    <a
                        href="#hero"
                        class="text-sm font-semibold uppercase tracking-wide text-white/90 transition-colors hover:text-white"
                    >
                        Start
                    </a>
                    <a
                        href="#leistungen"
                        class="text-sm font-semibold uppercase tracking-wide text-white/90 transition-colors hover:text-white"
                    >
                        Leistungen
                    </a>
                    <a
                        href="#ueber-uns"
                        class="text-sm font-semibold uppercase tracking-wide text-white/90 transition-colors hover:text-white"
                    >
                        Über uns
                    </a>
                    <a
                        href="#kontakt"
                        class="rounded px-3 py-1.5 text-sm font-semibold uppercase tracking-wide transition-colors"
                        :style="{ backgroundColor: colors.primary, color: '#fff' }"
                    >
                        Kontakt
                    </a>
                </nav>
            </div>
        </header>

        <main class="flex-1">
            <slot />
        </main>

        <footer
            class="border-t-2 py-6"
            :style="{ borderColor: colors.primary, backgroundColor: colors.secondary ?? '#0f172a' }"
        >
            <div class="mx-auto max-w-5xl px-4 sm:px-6 @sm:px-6">
                <div class="flex flex-col items-center justify-between gap-3 text-center sm:flex-row @sm:flex-row sm:text-left @sm:text-left">
                    <p class="text-xs uppercase tracking-widest text-white/80">
                        &copy; {{ new Date().getFullYear() }}
                        {{ (generalInformation?.name as string) ?? site.name }}
                    </p>
                    <div class="flex gap-4">
                        <a
                            href="/impressum"
                            class="text-xs font-medium uppercase tracking-wider text-white/90 transition-colors hover:text-white"
                        >
                            Impressum
                        </a>
                        <a
                            href="/datenschutz"
                            class="text-xs font-medium uppercase tracking-wider text-white/90 transition-colors hover:text-white"
                        >
                            Datenschutz
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    </div>
</template>
