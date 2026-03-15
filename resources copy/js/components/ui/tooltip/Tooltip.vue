<script setup lang="ts">
import { ref, computed, Transition } from 'vue';
import { cn } from '@/lib/utils';

type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';

interface Props {
    position?: TooltipPosition;
    class?: string;
}

const props = withDefaults(defineProps<Props>(), {
    position: 'top',
});

const isVisible = ref(false);
const triggerRef = ref<HTMLElement | null>(null);

const show = () => {
    isVisible.value = true;
};

const hide = () => {
    isVisible.value = false;
};

const positionClasses: Record<TooltipPosition, string> = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
};

const arrowClasses: Record<TooltipPosition, string> = {
    top: 'top-full left-1/2 -translate-x-1/2 border-t-gray-900 border-l-transparent border-r-transparent border-b-transparent',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 border-b-gray-900 border-l-transparent border-r-transparent border-t-transparent',
    left: 'left-full top-1/2 -translate-y-1/2 border-l-gray-900 border-t-transparent border-b-transparent border-r-transparent',
    right: 'right-full top-1/2 -translate-y-1/2 border-r-gray-900 border-t-transparent border-b-transparent border-l-transparent',
};

const tooltipClasses = computed(() =>
    cn(
        'absolute z-50 rounded-lg bg-gray-900 px-3 py-1.5 text-sm text-white shadow-modern-lg',
        'dark:bg-gray-800',
        positionClasses[props.position],
        props.class,
    ),
);

const arrowClass = computed(() =>
    cn('absolute h-0 w-0 border-4', arrowClasses[props.position]),
);
</script>

<template>
    <div
        ref="triggerRef"
        class="relative inline-block"
        @mouseenter="show"
        @mouseleave="hide"
    >
        <slot />
        <Transition
            enter-active-class="transition-opacity duration-200"
            enter-from-class="opacity-0"
            enter-to-class="opacity-100"
            leave-active-class="transition-opacity duration-150"
            leave-from-class="opacity-100"
            leave-to-class="opacity-0"
        >
            <div
                v-if="isVisible"
                :class="tooltipClasses"
                role="tooltip"
            >
                <div :class="arrowClass" />
                <slot name="content" />
            </div>
        </Transition>
    </div>
</template>
