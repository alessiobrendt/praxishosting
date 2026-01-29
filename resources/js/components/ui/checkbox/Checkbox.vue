<script setup lang="ts">
import { computed } from 'vue';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-vue-next';

interface Props {
    modelValue?: boolean;
    defaultValue?: boolean;
    disabled?: boolean;
    required?: boolean;
    class?: string;
    id?: string;
    name?: string;
    value?: string | number;
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

const checkboxClasses = computed(() =>
    cn(
        'peer h-4 w-4 shrink-0 rounded border-2 border-gray-300 bg-white',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2',
        'disabled:cursor-not-allowed disabled:opacity-50',
        'dark:border-gray-700 dark:bg-gray-800',
        'transition-modern',
        checked.value && 'gradient-primary border-emerald-700',
        props.class,
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
            :value="value"
            :disabled="disabled"
            :required="required"
            class="sr-only peer"
        />
        <div :class="checkboxClasses">
            <Check
                v-if="checked"
                class="h-3 w-3 text-white stroke-[3] absolute inset-0 m-auto"
            />
        </div>
    </div>
</template>
