<script lang="ts">
export const meta = {
    type: 'image',
    label: 'Bild',
    placement: 'above_main' as const,
    category: 'Inhalt',
    defaultData: { src: '', alt: '', caption: '', href: '' },
    fields: [
        { key: 'src', label: 'Bild-URL', type: 'image' as const },
        { key: 'alt', label: 'Alt-Text', type: 'text' as const },
        { key: 'caption', label: 'Bildunterschrift', type: 'text' as const },
        { key: 'href', label: 'Link (optional)', type: 'text' as const },
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
    <div class="mx-auto max-w-6xl px-4 py-4 sm:px-6">
        <figure>
            <a
                v-if="props.data.href"
                :href="designMode ? '#' : String(props.data.href || '')"
                class="block"
                @click="designMode && $event.preventDefault()"
            >
                <img
                    v-if="props.data.src"
                    :src="String(props.data.src)"
                    :alt="String(props.data.alt || '')"
                    class="w-full rounded-lg object-cover"
                />
                <div v-else class="flex aspect-video items-center justify-center rounded-lg bg-muted/30 text-muted-foreground text-sm">
                    Bild hinzufügen
                </div>
            </a>
            <template v-else>
                <img
                    v-if="props.data.src"
                    :src="String(props.data.src)"
                    :alt="String(props.data.alt || '')"
                    class="w-full rounded-lg object-cover"
                />
                <div v-else class="flex aspect-video items-center justify-center rounded-lg bg-muted/30 text-muted-foreground text-sm">
                    Bild hinzufügen
                </div>
            </template>
            <figcaption v-if="props.data.caption" class="mt-2 text-center text-sm" style="color: var(--tertiary)">
                {{ props.data.caption }}
            </figcaption>
        </figure>
    </div>
</template>
