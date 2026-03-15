<script setup lang="ts">
import { computed } from 'vue';
import { cn } from '@/lib/utils';
import { X } from 'lucide-vue-next';

interface Props {
    class?: string;
    dismissible?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    dismissible: true,
});

const emit = defineEmits<{
    (e: 'close'): void;
}>();

const headerClasses = computed(() =>
    cn('flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800', props.class),
);
</script>

<template>
    <div :class="headerClasses">
        <div class="flex-1">
            <slot />
        </div>
        <button
            v-if="dismissible"
            @click="emit('close')"
            class="rounded-lg p-1 transition-modern hover:bg-gray-100 dark:hover:bg-gray-800"
        >
            <X class="h-5 w-5 text-gray-500 dark:text-gray-400" />
        </button>
    </div>
</template>
