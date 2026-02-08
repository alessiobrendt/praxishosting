<script setup lang="ts">
defineProps<{
    title: string;
    subtitle?: string;
}>();
</script>

<template>
    <header class="mb-8">
        <h1 class="text-2xl font-semibold text-slate-900 sm:text-3xl @sm:text-3xl">{{ title }}</h1>
        <p v-if="subtitle" class="mt-2 text-slate-600">{{ subtitle }}</p>
    </header>
</template>
