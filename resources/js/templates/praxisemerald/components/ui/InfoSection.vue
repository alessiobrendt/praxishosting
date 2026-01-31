<script setup lang="ts">
import type { Component } from 'vue';

defineProps<{
    title: string;
    icon: Component;
}>();
</script>

<template>
    <div class="rounded-lg border bg-white p-4 shadow-sm">
        <h3 class="flex items-center gap-2 text-lg font-semibold text-slate-900">
            <component :is="icon" class="h-5 w-5 text-emerald-700" aria-hidden="true" />
            {{ title }}
        </h3>
        <div class="mt-3 text-sm text-slate-700">
            <slot />
        </div>
    </div>
</template>
