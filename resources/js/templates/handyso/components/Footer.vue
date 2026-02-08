<script setup lang="ts">
import { computed } from 'vue';
import { Clock, Mail, Phone, MapPin } from 'lucide-vue-next';

const props = withDefaults(
    defineProps<{
        data: Record<string, unknown>;
        designMode?: boolean;
    }>(),
    { designMode: false },
);

const siteName = computed(() => (props.data.siteName as string) ?? '');
const description = computed(() => (props.data.description as string) ?? '');
const address = computed(() => (props.data.address as string) ?? '');
const phone = computed(() => (props.data.phone as string) ?? '');
const email = computed(() => (props.data.email as string) ?? '');
const linksSeiten = computed(() => (props.data.linksSeiten as Array<{ href: string; label: string }>) ?? []);
const linksRechtliches = computed(
    () => (props.data.linksRechtliches as Array<{ href: string; label: string }>) ?? [],
);
const copyrightText = computed(() => (props.data.copyrightText as string) ?? '');
const creditLine = computed(() => (props.data.creditLine as string) ?? '');

const currentYear = new Date().getFullYear();
</script>

<template>
    <footer class="border-t border-gray-200 bg-[#010b1a] text-white">
        <div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 @sm:px-6">
            <div class="grid gap-8 sm:grid-cols-2 @sm:grid-cols-2 lg:grid-cols-4 @lg:grid-cols-4">
                <div class="sm:col-span-2 @sm:col-span-2">
                    <h3 class="text-lg font-semibold">{{ siteName }}</h3>
                    <p class="mt-2 text-sm text-gray-400">
                        {{ description }}
                    </p>
                    <div class="mt-4 space-y-2 text-sm text-gray-300">
                        <p v-if="address" class="flex items-center gap-2">
                            <MapPin class="h-4 w-4 shrink-0 text-[#fd7f2b]" aria-hidden />
                            {{ address }}
                        </p>
                        <p v-if="phone" class="flex items-center gap-2">
                            <Phone class="h-4 w-4 shrink-0 text-[#fd7f2b]" aria-hidden />
                            <a
                                :href="designMode ? '#' : `tel:${phone.replace(/\s/g, '')}`"
                                class="hover:text-[#fd7f2b]"
                                @click="designMode && $event.preventDefault()"
                            >
                                {{ phone }}
                            </a>
                        </p>
                        <p v-if="email" class="flex items-center gap-2">
                            <Mail class="h-4 w-4 shrink-0 text-[#fd7f2b]" aria-hidden />
                            <a
                                :href="designMode ? '#' : `mailto:${email}`"
                                class="hover:text-[#fd7f2b]"
                                @click="designMode && $event.preventDefault()"
                            >
                                {{ email }}
                            </a>
                        </p>
                    </div>
                </div>
                <div v-if="linksSeiten.length">
                    <h3 class="text-sm font-semibold uppercase tracking-wider text-gray-400">Seiten</h3>
                    <ul class="mt-4 space-y-2">
                        <li v-for="link in linksSeiten" :key="link.href">
                            <a
                                :href="designMode ? '#' : link.href"
                                class="text-sm text-gray-300 hover:text-[#fd7f2b]"
                                @click="designMode && $event.preventDefault()"
                            >
                                {{ link.label }}
                            </a>
                        </li>
                    </ul>
                </div>
                <div v-if="linksRechtliches.length">
                    <h3 class="text-sm font-semibold uppercase tracking-wider text-gray-400">Rechtliches</h3>
                    <ul class="mt-4 space-y-2">
                        <li v-for="link in linksRechtliches" :key="link.href">
                            <a
                                :href="designMode ? '#' : link.href"
                                class="text-sm text-gray-300 hover:text-[#fd7f2b]"
                                @click="designMode && $event.preventDefault()"
                            >
                                {{ link.label }}
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="border-t border-white/10">
            <div class="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-4 sm:flex-row @sm:flex-row sm:px-6 @sm:px-6">
                <p class="text-xs text-gray-500">© {{ currentYear }} {{ copyrightText }}</p>
                <p v-if="creditLine" class="text-xs text-gray-500">{{ creditLine }}</p>
            </div>
        </div>
    </footer>
</template>
