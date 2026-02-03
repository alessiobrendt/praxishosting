<script setup lang="ts">
import { computed } from 'vue';
import { ChevronRight } from 'lucide-vue-next';

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
const steps = computed(
    () =>
        (props.data.steps as Array<{
            number: string;
            imageSrc?: string;
            imageAlt?: string;
            title: string;
            desc: string;
        }>) ?? [],
);
</script>

<template>
    <section class="bg-white py-12 lg:py-16">
        <div class="mx-auto max-w-7xl px-4 sm:px-6">
            <span
                v-if="subheading"
                class="inline-block bg-[#fd7f2b] px-3 py-1 text-sm font-medium text-white"
            >
                {{ subheading }}
            </span>
            <h2 class="mt-3 text-2xl font-bold text-gray-900 sm:text-3xl">
                {{ heading }}
            </h2>
            <p class="mt-4 max-w-2xl text-gray-600">
                {{ text }}
            </p>
            <div class="mt-10 flex flex-wrap items-stretch gap-6 lg:gap-4">
                <template v-for="(step, i) in steps" :key="i">
                    <div class="flex flex-1 min-w-[200px] flex-col">
                        <div class="flex items-center gap-2">
                            <span
                                class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#fd7f2b] text-sm font-bold text-white"
                            >
                                {{ step.number }}
                            </span>
                            <ChevronRight
                                v-if="i < steps.length - 1"
                                class="hidden h-5 w-5 shrink-0 text-gray-300 lg:block"
                                aria-hidden
                            />
                        </div>
                        <div class="mt-4 overflow-hidden rounded-lg bg-gray-100">
                            <img
                                v-if="step.imageSrc"
                                :src="step.imageSrc"
                                :alt="step.imageAlt ?? step.title"
                                class="h-40 w-full object-cover"
                            />
                            <div
                                v-else
                                class="flex h-40 w-full items-center justify-center text-gray-400"
                            >
                                Schritt {{ step.number }}
                            </div>
                        </div>
                        <h3 class="mt-3 font-semibold text-gray-900">{{ step.title }}</h3>
                        <p class="mt-1 text-sm text-gray-600">{{ step.desc }}</p>
                    </div>
                </template>
            </div>
        </div>
    </section>
</template>
