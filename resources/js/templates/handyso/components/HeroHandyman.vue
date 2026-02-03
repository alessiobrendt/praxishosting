<script setup lang="ts">
import { computed } from 'vue';
import { ChevronRight, DoorOpen, Home, Hammer, Zap, Droplets, Paintbrush } from 'lucide-vue-next';
import type { Component } from 'vue';

const props = withDefaults(
    defineProps<{
        data: Record<string, unknown>;
        designMode?: boolean;
    }>(),
    { designMode: false },
);

const subheading = computed(() => (props.data.subheading as string) ?? '');
const heading = computed(() => (props.data.heading as string) ?? '');
const text = computed(() => (props.data.text as string) ?? '');
const buttonText = computed(() => (props.data.buttonText as string) ?? 'Learn More');
const buttonHref = computed(() => (props.data.buttonHref as string) ?? '#');
const reviewsText = computed(() => (props.data.reviewsText as string) ?? '');
const heroImageSrc = computed(() => (props.data.heroImageSrc as string) ?? '');
const heroImageAlt = computed(() => (props.data.heroImageAlt as string) ?? '');
const services = computed(
    () =>
        (props.data.services as Array<{ icon?: string; title: string; desc: string; readMoreHref?: string }>) ?? [],
);

const iconMap: Record<string, Component> = {
    DoorOpen,
    Home,
    Hammer,
    Zap,
    Droplets,
    Paintbrush,
};
</script>

<template>
    <section class="relative min-h-[480px] lg:min-h-[560px]">
        <div class="grid min-h-[480px] lg:min-h-[560px] lg:grid-cols-2">
            <!-- Left: dark blue + content -->
            <div class="flex flex-col justify-center bg-[#010b1a] px-6 py-12 lg:px-12 lg:py-16">
                <span
                    v-if="subheading"
                    class="mb-3 inline-block w-fit bg-[#fd7f2b] px-3 py-1 text-sm font-medium text-white"
                >
                    {{ subheading }}
                </span>
                <h1 class="text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
                    {{ heading }}
                </h1>
                <p class="mt-4 max-w-xl text-gray-300">
                    {{ text }}
                </p>
                <a
                    :href="designMode ? '#' : buttonHref"
                    class="mt-6 inline-flex w-fit items-center gap-2 rounded bg-[#fd7f2b] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#e67220]"
                    @click="designMode && $event.preventDefault()"
                >
                    {{ buttonText }}
                    <ChevronRight class="h-4 w-4" />
                </a>
                <p v-if="reviewsText" class="mt-8 flex items-center gap-2 text-sm text-white/90">
                    <span class="flex -space-x-2">
                        <span class="h-8 w-8 rounded-full border-2 border-[#010b1a] bg-gray-500" />
                        <span class="h-8 w-8 rounded-full border-2 border-[#010b1a] bg-gray-600" />
                        <span class="h-8 w-8 rounded-full border-2 border-[#010b1a] bg-gray-700" />
                    </span>
                    <span class="ml-1">+</span>
                    {{ reviewsText }}
                </p>
            </div>
            <!-- Right: hero image + overlay grid of 6 cards -->
            <div class="relative min-h-[280px] bg-[#010b1a] lg:min-h-[560px]">
                <img
                    v-if="heroImageSrc"
                    :src="heroImageSrc"
                    :alt="heroImageAlt"
                    class="absolute inset-0 h-full w-full object-cover opacity-60"
                />
                <div
                    class="absolute inset-0 grid grid-cols-2 gap-3 p-4 lg:gap-4 lg:p-6"
                    style="background: linear-gradient(135deg, rgba(1,11,26,0.85) 0%, rgba(1,11,26,0.6) 100%);"
                >
                    <div
                        v-for="(svc, i) in services.slice(0, 6)"
                        :key="i"
                        class="flex flex-col rounded-lg bg-[#010b1a]/90 p-4 text-white"
                    >
                        <component
                            :is="iconMap[svc.icon ?? ''] ?? Hammer"
                            class="h-8 w-8 shrink-0 text-[#fd7f2b]"
                        />
                        <h3 class="mt-2 text-sm font-semibold">{{ svc.title }}</h3>
                        <p class="mt-1 flex-1 text-xs text-gray-400">{{ svc.desc }}</p>
                        <a
                            :href="designMode ? '#' : (svc.readMoreHref ?? '#')"
                            class="mt-2 inline-flex items-center gap-1 text-xs font-medium text-[#fd7f2b] hover:underline"
                            @click="designMode && $event.preventDefault()"
                        >
                            Read More
                            <ChevronRight class="h-3 w-3" />
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>
