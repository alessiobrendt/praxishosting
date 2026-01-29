<script setup lang="ts">
import { computed } from 'vue';
import Button from '@/templates/praxisemerald/components/ui/Button.vue';
import type { HeroComponentData } from '@/types/layout-components';

const props = defineProps<{
    data: Partial<HeroComponentData>;
}>();

const heading = computed(() => props.data.heading ?? '');
const text = computed(() => props.data.text ?? '');
const buttons = computed(() => props.data.buttons ?? []);
const image = computed(() => props.data.image ?? { src: '', alt: '' });
</script>

<template>
    <section aria-labelledby="hero-heading" class="relative">
        <div class="mx-auto grid max-w-6xl grid-cols-1 items-center gap-8 px-4 py-12 sm:px-6 md:grid-cols-2">
            <div>
                <h1
                    id="hero-heading"
                    class="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl"
                >
                    {{ heading }}
                </h1>
                <p class="mt-4 text-slate-700">
                    {{ text }}
                </p>
                <div class="mt-6 flex flex-wrap gap-3">
                    <div v-for="(btn, idx) in buttons" :key="idx">
                        <Button :variant="(btn.variant as 'default' | 'outline') ?? 'default'">
                            <a
                                :href="btn.href"
                                :class="btn.variant === 'default' ? 'text-white' : 'text-black'"
                            >
                                {{ btn.text }}
                            </a>
                        </Button>
                    </div>
                </div>
            </div>
            <div v-if="image.src" class="relative">
                <div class="relative aspect-[4/3] overflow-hidden rounded-lg border shadow-sm">
                    <img
                        :src="image.src"
                        :alt="image.alt"
                        loading="eager"
                        class="h-full w-full object-cover"
                    />
                </div>
            </div>
        </div>
    </section>
</template>
