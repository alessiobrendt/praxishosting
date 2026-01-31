<script lang="ts">
export const meta = {
    type: 'contactform',
    label: 'Kontaktformular',
    placement: 'above_main' as const,
    category: 'Inhalt',
    defaultData: { note: '' },
    fields: [
        { key: 'note', label: 'Hinweistext (optional)', type: 'textarea' as const },
    ],
};
</script>

<script setup lang="ts">
import ContactForm from '@/templates/praxisemerald/components/ui/ContactForm.vue';

const props = defineProps<{ data: Record<string, unknown> }>();
</script>

<template>
    <div class="mx-auto max-w-6xl px-4 py-4 sm:px-6">
        <p v-if="props.data.note" class="mb-4 text-sm text-slate-600">
            {{ props.data.note }}
        </p>
        <ContactForm />
    </div>
</template>
