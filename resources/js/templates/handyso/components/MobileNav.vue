<script setup lang="ts">
import { ref } from 'vue';

interface NavLink {
    href: string;
    label: string;
}

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

const open = ref(false);
</script>

<template>
    <div class="pr-2 lg:hidden @lg:hidden">
        <button
            type="button"
            class="inline-flex h-10 w-10 items-center justify-center rounded-md border border-gray-200 bg-white p-2 text-gray-700 transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#fd7f2b]"
            aria-label="Menü öffnen"
            @click="open = !open"
        >
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
                class="fixed inset-y-0 right-0 z-50 w-full max-w-sm bg-white shadow-xl"
                aria-label="Mobile navigation"
            >
                <div class="flex h-full flex-col">
                    <div class="flex items-center justify-between border-b px-4 py-4">
                        <a
                            :href="designMode ? '#' : '/'"
                            class="flex items-center gap-2"
                            @click="open = false"
                        >
                            <img
                                v-if="logoUrl"
                                :src="logoUrl"
                                :alt="logoAlt ?? 'Logo'"
                                class="h-8 w-8 object-contain"
                            />
                            <span class="text-lg font-bold text-gray-900">{{ siteName }}</span>
                        </a>
                        <button
                            type="button"
                            class="rounded p-2 text-gray-500 hover:bg-gray-100"
                            aria-label="Menü schließen"
                            @click="open = false"
                        >
                            <svg class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    <div class="flex-1 overflow-y-auto px-4 py-4">
                        <ul class="space-y-1">
                            <li v-for="link in links" :key="link.href">
                                <a
                                    :href="designMode ? '#' : link.href"
                                    class="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-[#fd7f2b]/10 hover:text-[#fd7f2b]"
                                    @click="open = false"
                                >
                                    {{ link.label }}
                                </a>
                            </li>
                        </ul>
                        <a
                            v-if="ctaButtonText"
                            :href="designMode ? '#' : ctaButtonHref"
                            class="mt-4 block rounded-md bg-[#fd7f2b] px-4 py-3 text-center font-medium text-white hover:bg-[#e67220]"
                            @click="open = false"
                        >
                            {{ ctaButtonText }}
                        </a>
                    </div>
                </div>
            </nav>
        </transition>
    </div>
</template>
