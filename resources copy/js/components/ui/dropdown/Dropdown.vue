<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, Transition } from 'vue';
import { cn } from '@/lib/utils';

interface Props {
    align?: 'left' | 'right';
    class?: string;
}

const props = withDefaults(defineProps<Props>(), {
    align: 'left',
});

const isOpen = ref(false);
const triggerRef = ref<HTMLElement | null>(null);
const dropdownRef = ref<HTMLElement | null>(null);

const toggle = () => {
    isOpen.value = !isOpen.value;
};

const close = () => {
    isOpen.value = false;
};

const alignClasses = computed(() =>
    props.align === 'right' ? 'right-0' : 'left-0',
);

const handleClickOutside = (event: MouseEvent) => {
    if (
        dropdownRef.value &&
        !dropdownRef.value.contains(event.target as Node) &&
        triggerRef.value &&
        !triggerRef.value.contains(event.target as Node)
    ) {
        close();
    }
};

onMounted(() => {
    document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside);
});
</script>

<template>
    <div class="relative inline-block">
        <div ref="triggerRef" @click="toggle">
            <slot name="trigger" :is-open="isOpen" />
        </div>
        <Transition
            enter-active-class="transition-all duration-200"
            enter-from-class="opacity-0 scale-95 translate-y-[-10px]"
            enter-to-class="opacity-100 scale-100 translate-y-0"
            leave-active-class="transition-all duration-150"
            leave-from-class="opacity-100 scale-100 translate-y-0"
            leave-to-class="opacity-0 scale-95 translate-y-[-10px]"
        >
            <div
                v-if="isOpen"
                ref="dropdownRef"
                :class="cn(
                    'absolute z-50 mt-2 min-w-[8rem] rounded-lg border border-gray-200 bg-white shadow-modern-lg dark:border-gray-800 dark:bg-gray-900',
                    alignClasses,
                    props.class,
                )"
            >
                <slot />
            </div>
        </Transition>
    </div>
</template>
