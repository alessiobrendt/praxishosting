<script setup lang="ts">
import { ref, computed, inject } from 'vue';
import Button from '@/templates/praxisemerald/components/ui/Button.vue';
import NewsletterModule from '@/templates/praxisemerald/page_components/modules/NewsletterModule.vue';
import type { NavLink } from '@/types/layout-components';
import type { Ref } from 'vue';

const props = withDefaults(
    defineProps<{
        links: NavLink[];
        siteName?: string;
        logoUrl?: string;
        logoAlt?: string;
        ctaButtonText?: string;
        ctaButtonHref?: string;
        designMode?: boolean;
    }>(),
    { designMode: false },
);

const generalInfo = inject<{ value: Record<string, unknown> } | Ref<Record<string, unknown>>>('generalInformation', { value: {} });
const activeModules = computed(() => {
    const g = generalInfo?.value ?? (generalInfo as Ref<Record<string, unknown>>)?.value ?? {};
    const mods = g.active_modules;
    return Array.isArray(mods) ? mods : [];
});
const showNewsletter = computed(() => activeModules.value.includes('newsletter'));

const open = ref(false);
</script>

<template>
    <div class="pr-2 lg:hidden">
        <button
            type="button"
            class="inline-flex h-10 w-10 items-center justify-center rounded-md border border-slate-200 bg-white p-2 text-slate-700 shadow-sm transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-600"
            aria-label="Menü öffnen"
            @click="open = !open"
        >
            <span class="sr-only">Menü öffnen</span>
            <svg v-if="!open" class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <svg v-else class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
        </button>

        <transition name="fade">
            <div
                v-if="open"
                class="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
                aria-hidden="true"
                @click="open = false"
            />
        </transition>
        <transition name="slide">
            <nav
                v-if="open"
                class="fixed inset-0 z-50 h-screen w-screen bg-white shadow-lg transition"
                aria-label="Mobile navigation"
            >
                <div class="relative flex h-full flex-col">
                    <button
                        type="button"
                        class="absolute right-4 top-4 z-50 inline-flex h-10 w-10 items-center justify-center rounded-md border border-slate-200 bg-white p-2 text-slate-700 shadow-sm transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                        aria-label="Menü schließen"
                        @click="open = false"
                    >
                        <span class="sr-only">Menü schließen</span>
                        <svg class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    <a
                        href="/"
                        class="flex items-center gap-2 px-6 pt-6 pb-2"
                        aria-label="Zur Startseite"
                        @click="open = false"
                    >
                        <span class="inline-flex h-8 w-8 items-center justify-center rounded-md bg-emerald-600 text-white">
                            <img
                                v-if="logoUrl"
                                :src="logoUrl"
                                :alt="logoAlt ?? 'Logo'"
                                class="h-5 w-5 object-cover"
                                width="32"
                                height="32"
                                loading="lazy"
                            />
                        </span>
                        <span class="text-lg font-semibold">{{ siteName ?? 'Praxis' }}</span>
                    </a>

                    <ul class="flex flex-1 flex-col gap-2 p-6">
                        <li v-for="link in links" :key="link.href">
                            <a
                                :href="designMode ? '#' : link.href"
                                class="block rounded px-3 py-2 text-base font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-700"
                                @click="designMode ? $event.preventDefault() : (open = false)"
                            >
                                {{ link.label }}
                            </a>
                        </li>
                        <li v-if="showNewsletter && !designMode" class="mt-4 border-t pt-4">
                            <NewsletterModule :data="{ heading: 'Newsletter', buttonText: 'Anmelden' }" />
                        </li>
                        <li v-if="ctaButtonText" class="mt-4">
                            <Button variant="default" size="sm" class="w-full">
                                <a
                                    :href="designMode ? '#' : (ctaButtonHref ?? '#')"
                                    @click="designMode ? $event.preventDefault() : (open = false)"
                                >{{ ctaButtonText }}</a>
                            </Button>
                        </li>
                    </ul>
                </div>
            </nav>
        </transition>
    </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s;
}
.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
.slide-enter-active,
.slide-leave-active {
    transition: transform 0.25s;
}
.slide-enter-from {
    transform: translateX(100%);
}
.slide-leave-to {
    transform: translateX(100%);
}
</style>
