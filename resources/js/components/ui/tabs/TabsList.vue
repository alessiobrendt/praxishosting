<script setup lang="ts">
import { computed, inject, ref, type Ref } from 'vue';
import { cn } from '@/lib/utils';

interface Props {
    class?: string;
}

const props = defineProps<Props>();

const activeTab = inject<Ref<string>>('activeTab', ref(''));
const setActiveTab = inject<(tab: string) => void>('setActiveTab', () => {});

const listClasses = computed(() =>
    cn(
        'inline-flex h-10 items-center justify-center rounded-lg bg-gray-100 p-1 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
        props.class,
    ),
);
</script>

<template>
    <div :class="listClasses" role="tablist">
        <slot />
    </div>
</template>
