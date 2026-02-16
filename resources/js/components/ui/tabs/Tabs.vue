<script setup lang="ts">
import { ref, provide, watch } from 'vue';

interface Props {
    defaultTab?: string;
    modelValue?: string;
}

const props = withDefaults(defineProps<Props>(), { modelValue: undefined });

const emit = defineEmits<{ 'update:modelValue': [value: string] }>();

const activeTab = ref(props.modelValue ?? props.defaultTab ?? '');

watch(
    () => props.modelValue,
    (v) => {
        if (v !== undefined && v !== activeTab.value) activeTab.value = v;
    },
    { immediate: true },
);

const setActiveTab = (tab: string) => {
    activeTab.value = tab;
    emit('update:modelValue', tab);
};

provide('activeTab', activeTab);
provide('setActiveTab', setActiveTab);
</script>

<template>
    <div>
        <slot />
    </div>
</template>
