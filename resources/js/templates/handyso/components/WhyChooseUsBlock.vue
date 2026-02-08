<script setup lang="ts">
import { computed } from 'vue';
import { Wrench, Handshake, CheckCircle, Clock } from 'lucide-vue-next';
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
const benefits = computed(
    () => (props.data.benefits as Array<{ icon?: string; title: string }>) ?? [],
);

const iconMap: Record<string, Component> = {
    Wrench,
    Handshake,
    CheckCircle,
    Clock,
};
</script>

<template>
    <section class="relative overflow-hidden bg-gray-100 py-12 lg:py-16 @lg:py-16">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 @sm:px-6">
            <span
                v-if="subheading"
                class="inline-block bg-[#fd7f2b] px-3 py-1 text-sm font-medium text-white"
            >
                {{ subheading }}
            </span>
            <h2 class="mt-3 text-2xl font-bold text-gray-900 sm:text-3xl @sm:text-3xl">
                {{ heading }}
            </h2>
            <div class="mt-8 grid gap-6 sm:grid-cols-2 @sm:grid-cols-2">
                <div
                    v-for="(benefit, i) in benefits"
                    :key="i"
                    class="flex items-start gap-4 rounded-lg bg-white p-6 shadow-sm"
                >
                    <component
                        :is="iconMap[benefit.icon ?? ''] ?? CheckCircle"
                        class="h-10 w-10 shrink-0 text-[#fd7f2b]"
                    />
                    <h3 class="font-semibold text-gray-900">{{ benefit.title }}</h3>
                </div>
            </div>
        </div>
        <!-- Decorative tool belt image placeholder -->
        <div
            class="absolute left-0 top-1/2 hidden -translate-y-1/2 opacity-10 lg:block @lg:block"
            aria-hidden
        >
            <div class="h-48 w-32 rounded bg-[#fd7f2b]" />
        </div>
    </section>
</template>
