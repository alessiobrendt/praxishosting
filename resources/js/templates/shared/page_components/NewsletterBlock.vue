<script lang="ts">
export const meta = {
    type: 'newsletter',
    label: 'Newsletter',
    placement: 'above_main' as const,
    category: 'Module',
    defaultData: {
        moduleLabel: '',
        heading: 'Newsletter abonnieren',
        buttonText: 'Anmelden',
        subscribedMessage: 'Sie sind bereits für unseren Newsletter angemeldet.',
    },
    fields: [
        { key: 'moduleLabel', label: 'Modulname', type: 'text' as const },
        { key: 'heading', label: 'Überschrift', type: 'text' as const },
        { key: 'buttonText', label: 'Button-Text', type: 'text' as const },
        { key: 'subscribedMessage', label: 'Nachricht (bereits angemeldet)', type: 'textarea' as const },
    ],
};
</script>

<script setup lang="ts">
import { inject, computed } from 'vue';
import NewsletterModule from '@/templates/shared/page_components/modules/NewsletterModule.vue';

const props = defineProps<{ data: Record<string, unknown>; designMode?: boolean }>();

const layoutEntry = inject<{ value: { id: string } } | null>('layoutEntry', null);
const moduleInstanceId = computed(() => {
    const entry = layoutEntry?.value ?? layoutEntry;
    return (entry as { id?: string } | null)?.id ?? undefined;
});
</script>

<template>
    <div class="mx-auto max-w-6xl px-4 py-4 sm:px-6">
        <NewsletterModule
            :data="props.data"
            :module-instance-id="moduleInstanceId"
        />
    </div>
</template>
