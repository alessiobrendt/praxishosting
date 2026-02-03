<script setup lang="ts">
import { computed } from 'vue';
import { Check } from 'lucide-vue-next';

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
const image1Src = computed(() => (props.data.image1Src as string) ?? '');
const image1Alt = computed(() => (props.data.image1Alt as string) ?? '');
const image2Src = computed(() => (props.data.image2Src as string) ?? '');
const image2Alt = computed(() => (props.data.image2Alt as string) ?? '');
const badgeNumber = computed(() => (props.data.badgeNumber as string) ?? '30+');
const badgeLabel = computed(() => (props.data.badgeLabel as string) ?? 'Years of Experience');
const bullets = computed(() => (props.data.bullets as string[]) ?? []);
const buttonText = computed(() => (props.data.buttonText as string) ?? 'More About Us');
const buttonHref = computed(() => (props.data.buttonHref as string) ?? '#');
</script>

<template>
    <section class="bg-white py-12 lg:py-16">
        <div class="mx-auto max-w-7xl px-4 sm:px-6">
            <div class="grid gap-8 lg:grid-cols-2 lg:gap-12">
                <div class="relative flex flex-col gap-4">
                    <div class="relative aspect-[4/3] overflow-hidden rounded-lg">
                        <img
                            v-if="image1Src"
                            :src="image1Src"
                            :alt="image1Alt"
                            class="h-full w-full object-cover"
                        />
                        <div v-else class="flex h-full w-full items-center justify-center bg-gray-200 text-gray-500">
                            Bild 1
                        </div>
                    </div>
                    <div class="relative aspect-[4/3] overflow-hidden rounded-lg">
                        <img
                            v-if="image2Src"
                            :src="image2Src"
                            :alt="image2Alt"
                            class="h-full w-full object-cover"
                        />
                        <div v-else class="flex h-full w-full items-center justify-center bg-gray-200 text-gray-500">
                            Bild 2
                        </div>
                    </div>
                    <div
                        class="rounded-lg bg-[#010b1a] px-6 py-4 text-white shadow-lg"
                    >
                        <span class="text-3xl font-bold">{{ badgeNumber }}</span>
                        <span class="ml-2 text-sm">{{ badgeLabel }}</span>
                    </div>
                </div>
                <div class="flex flex-col justify-center">
                    <span
                        v-if="subheading"
                        class="inline-block w-fit bg-[#fd7f2b] px-3 py-1 text-sm font-medium text-white"
                    >
                        {{ subheading }}
                    </span>
                    <h2 class="mt-3 text-2xl font-bold text-gray-900 sm:text-3xl">
                        {{ heading }}
                    </h2>
                    <p class="mt-4 text-gray-600">
                        {{ text }}
                    </p>
                    <ul class="mt-6 space-y-3">
                        <li
                            v-for="(bullet, i) in bullets"
                            :key="i"
                            class="flex items-center gap-2 text-gray-700"
                        >
                            <span class="flex h-5 w-5 shrink-0 items-center justify-center bg-[#fd7f2b] text-white">
                                <Check class="h-3 w-3" />
                            </span>
                            {{ bullet }}
                        </li>
                    </ul>
                    <a
                        :href="designMode ? '#' : buttonHref"
                        class="mt-8 inline-flex w-fit rounded bg-[#fd7f2b] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#e67220]"
                        @click="designMode && $event.preventDefault()"
                    >
                        {{ buttonText }}
                    </a>
                </div>
            </div>
        </div>
    </section>
</template>
