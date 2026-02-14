<script setup lang="ts">
import { computed, inject } from 'vue';
import Button from '@/templates/praxisemerald/components/ui/Button.vue';
import InlineTextEditor from '@/templates/shared/components/InlineTextEditor.vue';
import InlineEditableText from '@/pages/PageDesigner/components/InlineEditableText.vue';
import type { HeroComponentData } from '@/types/layout-components';

const props = withDefaults(
    defineProps<{ data: Partial<HeroComponentData>; designMode?: boolean }>(),
    { designMode: false },
);

const layoutEntry = inject<{ value: { id: string } } | null>('layoutEntry', null);
const selectedModuleId = inject<{ value: string | null } | null>('selectedModuleId', null);
const isSelected = computed(() => !!layoutEntry?.value && layoutEntry.value.id === selectedModuleId?.value);

const heading = computed(() => props.data.heading ?? '');
const text = computed(() => props.data.text ?? '');
const buttons = computed(() => props.data.buttons ?? []);
const image = computed(() => props.data.image ?? { src: '', alt: '' });

function setHeading(v: string): void {
    (props.data as Record<string, unknown>).heading = v;
}

function setText(v: string): void {
    (props.data as Record<string, unknown>).text = v;
}
</script>

<template>
    <section aria-labelledby="hero-heading" class="relative">
        <div class="mx-auto grid max-w-6xl grid-cols-1 items-center gap-8 px-4 py-12 sm:px-6 @sm:px-6 md:grid-cols-2 @md:grid-cols-2">
            <div>
                <InlineTextEditor
                    id="hero-heading"
                    :model-value="heading"
                    :design-mode="designMode"
                    :is-selected="isSelected"
                    tag="h1"
                    class="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl @sm:text-4xl"
                    @update:model-value="setHeading"
                />
                <InlineEditableText
                    v-if="layoutEntry?.value?.id"
                    :model-value="text"
                    :design-mode="designMode"
                    :is-selected="isSelected"
                    :entry-id="layoutEntry.value.id"
                    field-key="text"
                    tag="div"
                    class="mt-4 text-slate-700"
                    placeholder="Beschreibungstext…"
                    html
                    @update:model-value="setText"
                />
                <div
                    v-else
                    class="mt-4 prose prose-sm max-w-none text-slate-700"
                    v-html="text || '<p class=\'text-muted-foreground\'>Beschreibungstext…</p>'"
                />
                <div class="mt-6 flex flex-wrap gap-3">
                    <div v-for="(btn, idx) in buttons" :key="idx">
                        <Button :variant="(btn.variant as 'default' | 'outline') ?? 'default'">
                            <a
                                :href="designMode ? '#' : btn.href"
                                :class="btn.variant === 'default' ? 'text-white' : 'text-black'"
                                @click="designMode && $event.preventDefault()"
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
