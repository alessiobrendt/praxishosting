<script setup lang="ts">
import { ref, provide } from 'vue';

interface Props {
    defaultTab?: string;
}

const props = defineProps<Props>();

const activeTab = ref(props.defaultTab || '');

const setActiveTab = (tab: string) => {
    activeTab.value = tab;
};

provide('activeTab', activeTab);
provide('setActiveTab', setActiveTab);
</script>

<template>
    <div>
        <slot />
    </div>
</template>
