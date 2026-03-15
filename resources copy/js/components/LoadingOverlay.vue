<script setup lang="ts">
import LoadingAnimation from '@/components/LoadingAnimation.vue';
</script>

<template>
    <div
        class="fixed inset-0 z-[100] flex items-center justify-center bg-background/90 backdrop-blur-sm"
        role="status"
        aria-live="polite"
        aria-label="Seite wird geladen"
    >
        <LoadingAnimation :size="200" />
    </div>
</template>
