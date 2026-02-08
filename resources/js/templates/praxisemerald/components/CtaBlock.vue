<script setup lang="ts">
import { computed } from 'vue';
import type { CtaComponentData } from '@/types/layout-components';

const props = withDefaults(
    defineProps<{ data: Partial<CtaComponentData>; designMode?: boolean }>(),
    { designMode: false },
);

const heading = computed(() => props.data.heading ?? '');
const text = computed(() => props.data.text ?? '');
const links = computed(() => props.data.links ?? []);
const image = computed(() => props.data.image ?? { src: '', alt: '' });
</script>

<template>
    <section
        aria-labelledby="cta-block-heading"
        class="border-t px-4 py-12"
        style="background-color: var(--quaternary)"
    >
        <div class="mx-auto flex max-w-6xl flex-col items-center gap-6 text-center sm:px-6 @sm:px-6">
            <h2
                id="cta-block-heading"
                class="text-2xl font-semibold"
                style="color: var(--secondary)"
            >
                {{ heading }}
            </h2>
            <p class="max-w-2xl" style="color: var(--tertiary)">
                {{ text }}
            </p>
            <div class="flex flex-wrap items-center justify-center gap-3">
                <a
                    v-for="(link, index) in links"
                    :key="index"
                    :href="designMode ? '#' : link.href"
                    class="rounded-md px-4 py-2 transition-colors"
                    @click="designMode && $event.preventDefault()"
                    :style="
                        link.variant === 'primary'
                            ? { backgroundColor: 'var(--primary)', color: '#ffffff' }
                            : { color: 'var(--secondary)', border: '1px solid var(--tertiary)' }
                    "
                    @mouseenter="
                        (e) => {
                            if (link.variant === 'primary') {
                                (e.target as HTMLElement).style.backgroundColor = 'var(--primary-hover)';
                            } else {
                                (e.target as HTMLElement).style.backgroundColor = 'var(--quinary)';
                            }
                        }
                    "
                    @mouseleave="
                        (e) => {
                            if (link.variant === 'primary') {
                                (e.target as HTMLElement).style.backgroundColor = 'var(--primary)';
                            } else {
                                (e.target as HTMLElement).style.backgroundColor = 'transparent';
                            }
                        }
                    "
                >
                    {{ link.text }}
                </a>
            </div>
            <div v-if="image.src" class="relative mt-6 w-48 overflow-hidden rounded-lg border">
                <img
                    :src="image.src"
                    :alt="image.alt"
                    loading="lazy"
                    class="h-full w-full object-cover"
                />
            </div>
        </div>
    </section>
</template>
