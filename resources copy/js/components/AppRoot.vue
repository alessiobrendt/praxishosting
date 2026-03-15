<script setup lang="ts">
import { router } from '@inertiajs/vue3';
import { onMounted, ref } from 'vue';
import type { Component } from 'vue';
import CookieBanner from '@/components/CookieBanner.vue';
import LoadingOverlay from '@/components/LoadingOverlay.vue';
import ToastContainer from '@/components/ToastContainer.vue';

defineProps<{
    appComponent: Component;
    appProps: object;
}>();

const isNavigating = ref(false);

onMounted(() => {
    router.on('start', () => {
        isNavigating.value = true;
    });
    router.on('finish', () => {
        isNavigating.value = false;
    });
});
</script>

<template>
    <div class="min-h-full">
        <LoadingOverlay v-if="isNavigating" />
        <ToastContainer />
        <CookieBanner />
        <component :is="appComponent" v-bind="appProps" />
    </div>
</template>
