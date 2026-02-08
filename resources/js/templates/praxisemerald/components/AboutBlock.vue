<script setup lang="ts">
import { computed } from 'vue';
import type { AboutComponentData } from '@/types/layout-components';
import { HeartPulse, ShieldCheck, Stethoscope, Syringe, Clock } from 'lucide-vue-next';

const props = defineProps<{
    data: Partial<AboutComponentData>;
}>();

const heading = computed(() => props.data.heading ?? '');
const text = computed(() => props.data.text ?? '');
const features = computed(() => props.data.features ?? []);

const iconMap = {
    Stethoscope,
    Syringe,
    ShieldCheck,
    HeartPulse,
    Clock,
};

type FeatureIcon = keyof typeof iconMap;
</script>

<template>
    <section aria-labelledby="about-block-heading" class="mx-auto max-w-6xl px-4 py-12 sm:px-6 @sm:px-6">
        <h2
            id="about-block-heading"
            class="text-2xl font-semibold"
            style="color: var(--secondary)"
        >
            {{ heading }}
        </h2>
        <p class="mt-4" style="color: var(--tertiary)">
            {{ text }}
        </p>
        <div class="mt-6 grid gap-4 sm:grid-cols-2 @sm:grid-cols-2">
            <div
                v-for="(feature, index) in features"
                :key="index"
                class="flex items-start gap-3 rounded-lg border bg-white p-4 shadow-sm"
            >
                <component
                    :is="iconMap[feature.icon as FeatureIcon] ?? Stethoscope"
                    class="mt-0.5 h-5 w-5 shrink-0"
                    style="color: var(--primary-dark)"
                    aria-hidden="true"
                />
                <div>
                    <h3 class="font-medium">{{ feature.title }}</h3>
                    <p class="text-sm" style="color: var(--tertiary)">{{ feature.desc }}</p>
                </div>
            </div>
        </div>
    </section>
</template>
