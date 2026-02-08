<script lang="ts">
export const meta = {
    type: 'imagetext',
    label: 'Bild und Text',
    placement: 'above_main' as const,
    category: 'Inhalt',
    defaultData: {
        imageSrc: '',
        imageAlt: '',
        imagePosition: 'left',
        heading: '',
        text: '',
        buttonText: '',
        buttonHref: '',
    },
    fields: [
        { key: 'imageSrc', label: 'Bild-URL', type: 'image' as const },
        { key: 'imageAlt', label: 'Alt-Text', type: 'text' as const },
        { key: 'imagePosition', label: 'Bildposition', type: 'select' as const, options: ['left', 'right'] },
        { key: 'heading', label: 'Überschrift', type: 'text' as const },
        { key: 'text', label: 'Text', type: 'textarea' as const },
        { key: 'buttonText', label: 'Button-Text (optional)', type: 'text' as const },
        { key: 'buttonHref', label: 'Button-Link (optional)', type: 'text' as const },
    ],
};
</script>

<script setup lang="ts">
const props = withDefaults(
    defineProps<{ data: Record<string, unknown>; designMode?: boolean }>(),
    { designMode: false },
);
</script>

<template>
    <div class="mx-auto max-w-6xl px-4 py-6 sm:px-6 @sm:px-6">
        <div class="grid gap-6 sm:grid-cols-2 @sm:grid-cols-2 sm:items-center @sm:items-center">
            <div :class="props.data.imagePosition === 'right' ? 'sm:order-2 @sm:order-2' : 'sm:order-1 @sm:order-1'">
                <img
                    v-if="props.data.imageSrc"
                    :src="String(props.data.imageSrc)"
                    :alt="String(props.data.imageAlt || '')"
                    class="w-full rounded-lg object-cover"
                />
                <div v-else class="flex aspect-video items-center justify-center rounded-lg bg-muted/30 text-muted-foreground text-sm">
                    Bild hinzufügen
                </div>
            </div>
            <div :class="props.data.imagePosition === 'right' ? 'sm:order-1 @sm:order-1' : 'sm:order-2 @sm:order-2'">
                <h2 v-if="props.data.heading" class="text-xl font-semibold" style="color: var(--secondary)">
                    {{ props.data.heading }}
                </h2>
                <p class="mt-2 text-base" style="color: var(--tertiary)">
                    {{ props.data.text || 'Text hier eingeben…' }}
                </p>
                <a
                    v-if="props.data.buttonText"
                    :href="designMode ? '#' : String(props.data.buttonHref || '#')"
                    class="mt-4 inline-flex rounded-md px-4 py-2 text-sm font-medium"
                    style="background-color: var(--primary); color: var(--primary-foreground)"
                    @click="designMode && $event.preventDefault()"
                >
                    {{ props.data.buttonText }}
                </a>
            </div>
        </div>
    </div>
</template>
