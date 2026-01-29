<script setup lang="ts">
import { computed, inject, ref, type Ref } from 'vue';
import { cn } from '@/lib/utils';

interface Props {
    value: string;
    class?: string;
}

const props = defineProps<Props>();

const activeTab = inject<Ref<string>>('activeTab', ref(''));
const setActiveTab = inject<(tab: string) => void>('setActiveTab', () => {});

const isActive = computed(() => activeTab.value === props.value);

const triggerClasses = computed(() =>
    cn(
        'inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition-modern',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2',
        'disabled:pointer-events-none disabled:opacity-50',
        isActive.value
            ? 'gradient-primary text-white shadow-emerald'
            : 'text-gray-600 hover:bg-gray-200 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-100',
        props.class,
    ),
);
</script>

<template>
    <button
        :class="triggerClasses"
        role="tab"
        :aria-selected="isActive"
        @click="setActiveTab(value)"
    >
        <slot />
    </button>
</template>
