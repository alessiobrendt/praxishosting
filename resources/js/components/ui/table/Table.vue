<script setup lang="ts">
import { computed } from 'vue';
import { cn } from '@/lib/utils';

interface Props {
    striped?: boolean;
    hover?: boolean;
    class?: string;
}

const props = withDefaults(defineProps<Props>(), {
    striped: false,
    hover: true,
});

const tableClasses = computed(() =>
    cn('w-full caption-bottom text-sm', props.class),
);
</script>

<template>
    <div class="relative w-full overflow-auto">
        <table :class="tableClasses">
            <slot />
        </table>
    </div>
</template>
