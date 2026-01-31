<script setup lang="ts">
import { computed } from 'vue';
import { Clock, Mail, Phone, MapPin } from 'lucide-vue-next';
import type { FooterComponentData } from '@/types/layout-components';

const props = withDefaults(
    defineProps<{ data: Partial<FooterComponentData>; designMode?: boolean }>(),
    { designMode: false },
);

const siteName = computed(() => props.data.siteName ?? '');
const description = computed(() => props.data.description ?? '');
const address = computed(() => props.data.address ?? '');
const phone = computed(() => props.data.phone ?? '');
const email = computed(() => props.data.email ?? '');
const openingLine = computed(() => props.data.openingLine ?? '');
const linksSeiten = computed(() => props.data.linksSeiten ?? []);
const linksRechtliches = computed(() => props.data.linksRechtliches ?? []);
const copyrightText = computed(() => props.data.copyrightText ?? '');
const creditLine = computed(() => props.data.creditLine ?? '');

const currentYear = new Date().getFullYear();
</script>

<template>
    <footer class="mt-16 border-t bg-slate-50">
        <div class="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 py-10 sm:grid-cols-3 sm:px-6">
            <div>
                <h3 class="text-sm font-semibold text-slate-900">{{ siteName }}</h3>
                <p class="mt-2 text-sm text-slate-700">
                    {{ description }}
                </p>
                <div class="mt-4 space-y-2 text-sm text-slate-700">
                    <p v-if="address" class="flex items-center gap-2">
                        <MapPin class="h-4 w-4 text-emerald-700" aria-hidden="true" />
                        {{ address }}
                    </p>
                    <p v-if="phone" class="flex items-center gap-2">
                        <Phone class="h-4 w-4 text-emerald-700" aria-hidden="true" />
                        <a
                            :href="designMode ? '#' : `tel:${phone}`"
                            class="hover:underline"
                            @click="designMode && $event.preventDefault()"
                        >{{ phone }}</a>
                    </p>
                    <p v-if="email" class="flex items-center gap-2">
                        <Mail class="h-4 w-4 text-emerald-700" aria-hidden="true" />
                        <a
                            :href="designMode ? '#' : `mailto:${email}`"
                            class="hover:underline"
                            @click="designMode && $event.preventDefault()"
                        >{{ email }}</a>
                    </p>
                    <p v-if="openingLine" class="flex items-center gap-2">
                        <Clock class="h-4 w-4 text-emerald-700" aria-hidden="true" />
                        {{ openingLine }}
                    </p>
                </div>
            </div>
            <div v-if="linksSeiten.length">
                <h3 class="text-sm font-semibold text-slate-900">Seiten</h3>
                <ul class="mt-2 space-y-2 text-sm">
                        <li v-for="link in linksSeiten" :key="link.href">
                        <a
                            :href="designMode ? '#' : link.href"
                            class="hover:underline"
                            @click="designMode && $event.preventDefault()"
                        >{{ link.label }}</a>
                    </li>
                </ul>
            </div>
            <div v-if="linksRechtliches.length">
                <h3 class="text-sm font-semibold text-slate-900">Rechtliches</h3>
                <ul class="mt-2 space-y-2 text-sm">
                        <li v-for="link in linksRechtliches" :key="link.href">
                        <a
                            :href="designMode ? '#' : link.href"
                            class="hover:underline"
                            @click="designMode && $event.preventDefault()"
                        >{{ link.label }}</a>
                    </li>
                </ul>
            </div>
        </div>
        <div class="border-t">
            <div class="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
                <p class="text-xs text-slate-600">© {{ currentYear }} {{ copyrightText }}</p>
                <p v-if="creditLine" class="text-xs text-slate-600">{{ creditLine }}</p>
            </div>
        </div>
    </footer>
</template>
