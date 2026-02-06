<script lang="ts">
export const meta = {
    type: 'notice',
    label: 'Hinweis-Streifen',
    placement: 'above_main' as const,
    category: 'Inhalt',
    defaultData: { icon: 'Info', text: '' },
    fields: [
        { key: 'icon', label: 'Icon', type: 'icon' as const },
        { key: 'text', label: 'Text', type: 'textarea' as const },
    ],
};
</script>

<script setup lang="ts">
import * as LucideIcons from 'lucide-vue-next';

const props = defineProps<{ data: Record<string, unknown> }>();

const invalidIconNames = new Set(['Icon', 'createLucideIcon']);
const iconName = () => String(props.data.icon ?? 'Info');
const iconComponent = () => {
    const name = iconName();
    if (invalidIconNames.has(name)) return LucideIcons.Info;
    const icons = LucideIcons as unknown as Record<string, (typeof LucideIcons)['Info']>;
    return icons[name] ?? LucideIcons.Info;
};
</script>

<template>
    <div class="mx-auto max-w-6xl px-4 py-4 sm:px-6">
        <div class="flex items-center gap-2 rounded-lg border border-amber-500/50 bg-amber-50 p-4 text-sm text-amber-900 dark:bg-amber-950/30 dark:text-amber-200">
            <component :is="iconComponent()" class="h-4 w-4 shrink-0" aria-hidden="true" />
            <p>{{ props.data.text || 'Hinweis eingeben…' }}</p>
        </div>
    </div>
</template>
