<script setup lang="ts">
import { computed } from 'vue';
import { Wrench, Calendar, ShieldCheck } from 'lucide-vue-next';
import type { Component } from 'vue';

const props = withDefaults(
    defineProps<{
        data: Record<string, unknown>;
        designMode?: boolean;
    }>(),
    { designMode: false },
);

const bannerText = computed(() => (props.data.bannerText as string) ?? '');
const features = computed(
    () =>
        (props.data.features as Array<{ icon?: string; title: string; desc: string }>) ?? [],
);

const iconMap: Record<string, Component> = {
    Wrench,
    Calendar,
    ShieldCheck,
};
</script>

<template>
    <section class="bg-gray-100 py-12 lg:py-16">
        <div class="mx-auto flex max-w-7xl flex-col gap-8 px-4 sm:px-6 lg:flex-row lg:items-stretch lg:gap-0">
            <div
                class="flex shrink-0 items-center justify-center rounded-t-2xl bg-[#fd7f2b] px-8 py-10 lg:rounded-l-2xl lg:rounded-tr-none lg:py-16"
            >
                <h2 class="max-w-xs text-center text-xl font-bold leading-snug text-white lg:text-2xl">
                    {{ bannerText }}
                </h2>
            </div>
            <div class="grid flex-1 gap-6 sm:grid-cols-3 lg:grid-cols-3">
                <div
                    v-for="(feat, i) in features"
                    :key="i"
                    class="flex flex-col rounded-t-2xl bg-white p-6 shadow-sm"
                >
                    <component
                        :is="iconMap[feat.icon ?? ''] ?? Wrench"
                        class="h-10 w-10 shrink-0 text-gray-400"
                    />
                    <h3 class="mt-3 text-lg font-semibold text-[#fd7f2b]">{{ feat.title }}</h3>
                    <p class="mt-2 text-sm text-gray-600">{{ feat.desc }}</p>
                </div>
            </div>
        </div>
    </section>
</template>
