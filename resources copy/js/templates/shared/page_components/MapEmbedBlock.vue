<script lang="ts">
export const meta = {
    type: 'mapembed',
    label: 'Karte (Einbettung)',
    placement: 'above_main' as const,
    category: 'Inhalt',
    defaultData: { embedUrl: '' },
    fields: [
        { key: 'embedUrl', label: 'Karten-Embed-URL (z. B. Google Maps)', type: 'textarea' as const },
    ],
};
</script>

<script setup lang="ts">
const props = defineProps<{ data: Record<string, unknown> }>();

const embedUrl = () => String(props.data.embedUrl ?? '').trim();
</script>

<template>
    <div class="mx-auto max-w-6xl px-4 py-4 sm:px-6 @sm:px-6">
        <div v-if="embedUrl()" class="overflow-hidden rounded-md border">
            <iframe
                :src="embedUrl()"
                title="Karte"
                class="h-72 w-full"
                loading="lazy"
            />
        </div>
        <div v-else class="flex aspect-video items-center justify-center rounded-lg border border-dashed bg-muted/30 text-muted-foreground text-sm">
            Embed-URL im Kontext-Panel eingeben (z. B. Google Maps Einbettungs-URL).
        </div>
    </div>
</template>
