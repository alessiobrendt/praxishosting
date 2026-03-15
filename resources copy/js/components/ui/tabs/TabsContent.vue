<script setup lang="ts">
import { computed, inject, ref, type Ref } from 'vue';
import { cn } from '@/lib/utils';

interface Props {
    value: string;
    class?: string;
}

const props = defineProps<Props>();

const activeTab = inject<Ref<string>>('activeTab', ref(''));

const isActive = computed(() => activeTab.value === props.value);

const contentClasses = computed(() =>
    cn(
        'mt-2 focus-visible:outline-none',
        props.class,
    ),
);
</script>

<template>
    <div
        v-if="isActive"
        :class="contentClasses"
        role="tabpanel"
    >
        <slot />
    </div>
</template>
