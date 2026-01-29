<script setup lang="ts">
import { computed } from 'vue';
import { cn } from '@/lib/utils';

interface Props {
    class?: string;
}

const props = defineProps<Props>();

const titleClasses = computed(() =>
    cn('mb-1 font-semibold leading-none tracking-tight', props.class),
);
</script>

<template>
    <h5 :class="titleClasses">
        <slot />
    </h5>
</template>
