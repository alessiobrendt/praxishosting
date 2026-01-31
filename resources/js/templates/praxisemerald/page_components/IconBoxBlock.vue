<script lang="ts">
export const meta = {
    type: 'iconbox',
    label: 'Icon-Box',
    placement: 'above_main' as const,
    category: 'Inhalt',
    defaultData: { icon: 'Stethoscope', title: '', text: '' },
    fields: [
        { key: 'icon', label: 'Icon', type: 'icon' as const },
        { key: 'title', label: 'Titel', type: 'text' as const },
        { key: 'text', label: 'Text', type: 'textarea' as const },
    ],
};
</script>

<script setup lang="ts">
import * as LucideIcons from 'lucide-vue-next';

const props = defineProps<{ data: Record<string, unknown> }>();

const invalidIconNames = new Set(['Icon', 'createLucideIcon']);

const iconName = () => String(props.data.icon ?? '');
const iconComponent = () => {
    const name = iconName();
    if (invalidIconNames.has(name)) return LucideIcons.Stethoscope;
    const icons = LucideIcons as unknown as Record<string, (typeof LucideIcons)['Stethoscope']>;
    return icons[name] ?? LucideIcons.Stethoscope;
};
</script>

<template>
    <div class="mx-auto max-w-6xl px-4 py-4 sm:px-6">
        <div class="flex items-start gap-3 rounded-lg border bg-white p-4 shadow-sm">
            <component
                :is="iconComponent()"
                class="mt-0.5 h-6 w-6 shrink-0"
                style="color: var(--primary-dark)"
                aria-hidden="true"
            />
            <div>
                <h3 v-if="props.data.title" class="font-semibold" style="color: var(--secondary)">
                    {{ props.data.title }}
                </h3>
                <p class="mt-1 text-sm" style="color: var(--tertiary)">
                    {{ props.data.text || 'Text hier eingeben…' }}
                </p>
            </div>
        </div>
    </div>
</template>
