<template>
    <VerticalLayout v-if="layout.orientation === 'vertical'">
        <slot />
    </VerticalLayout>

    <HorizontalLayout v-else-if="layout.orientation === 'horizontal'">
        <slot />
    </HorizontalLayout>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import VerticalLayout from '@/layouts/VerticalLayout.vue';
import HorizontalLayout from '@/layouts/HorizontalLayout.vue';
import { useLayout } from '@/stores/layout';

const layoutStore = useLayout();
const { layout } = storeToRefs(layoutStore);
</script>
