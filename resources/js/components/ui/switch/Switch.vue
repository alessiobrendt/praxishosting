<script setup lang="ts">
import { computed } from 'vue';
import { cn } from '@/lib/utils';

interface Props {
    modelValue?: boolean;
    defaultValue?: boolean;
    disabled?: boolean;
    required?: boolean;
    class?: string;
    id?: string;
    name?: string;
}

const props = withDefaults(defineProps<Props>(), {
    disabled: false,
    required: false,
    defaultValue: false,
});

const emit = defineEmits<{
    (e: 'update:modelValue', value: boolean): void;
}>();

const checked = computed({
    get: () => props.modelValue ?? props.defaultValue ?? false,
    set: (val) => emit('update:modelValue', val),
});

const switchClasses = computed(() =>
    cn(
        'peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent',
        'transition-modern-slow',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2',
        'disabled:cursor-not-allowed disabled:opacity-50',
        checked.value ? 'gradient-primary' : 'bg-gray-300 dark:bg-gray-700',
        props.class,
    ),
);

const thumbClasses = computed(() =>
    cn(
        'pointer-events-none block h-5 w-5 rounded-full bg-white shadow-modern-lg',
        'transition-modern-slow transform',
        checked.value ? 'translate-x-5' : 'translate-x-0',
    ),
);
</script>

<template>
    <div class="relative inline-flex items-center">
        <input
            :id="id"
            :name="name"
            v-model="checked"
            type="checkbox"
            role="switch"
            :disabled="disabled"
            :required="required"
            class="sr-only peer"
        />
        <div
            :class="switchClasses"
            @click="!disabled && (checked = !checked)"
        >
            <span :class="thumbClasses" />
        </div>
    </div>
</template>
