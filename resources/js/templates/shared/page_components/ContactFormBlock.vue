<script lang="ts">
import type { Component } from 'vue';
import ContactFormBlockEditor from './editors/ContactFormBlockEditor.vue';

export const meta = {
    type: 'contactform',
    label: 'Kontaktformular',
    placement: 'above_main' as const,
    category: 'Module',
    defaultData: {
        moduleLabel: '',
        note: '',
        fields: [
            { key: 'name', label: 'Name', type: 'text' as const, required: true },
            { key: 'email', label: 'E-Mail', type: 'email' as const, required: true },
            { key: 'message', label: 'Nachricht', type: 'textarea' as const, required: true },
        ],
    },
};
export const Editor = ContactFormBlockEditor as Component;
</script>

<script setup lang="ts">
import { inject, computed } from 'vue';
import ContactFormModule from '@/templates/shared/page_components/modules/ContactFormModule.vue';

const props = defineProps<{ data: Record<string, unknown>; designMode?: boolean }>();

const layoutEntry = inject<{ value: { id: string } } | null>('layoutEntry', null);
const moduleInstanceId = computed(() => {
    const entry = layoutEntry?.value ?? layoutEntry;
    return (entry as { id?: string } | null)?.id ?? undefined;
});
</script>

<template>
    <ContactFormModule
        :data="props.data"
        :module-instance-id="moduleInstanceId"
    />
</template>
