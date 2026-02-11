<script setup lang="ts">
import type { Component } from 'vue';

defineProps<{
    title: string;
    icon: Component;
    highlight?: string;
    desc: string;
    href?: string;
}>();
</script>

<template>
    <a
        v-if="href"
        :href="href"
        class="flex flex-col gap-2 rounded-lg border bg-white p-4 shadow-sm transition hover:border-primary"
    >
        <div class="flex items-center justify-between">
            <component :is="icon" class="h-5 w-5 text-primary" aria-hidden="true" />
            <span v-if="highlight" class="text-lg font-semibold text-primary">{{ highlight }}</span>
        </div>
        <h2 class="text-lg font-semibold text-slate-900">{{ title }}</h2>
        <p class="text-sm text-slate-700">{{ desc }}</p>
    </a>
    <div v-else class="flex flex-col gap-2 rounded-lg border bg-white p-4 shadow-sm">
        <div class="flex items-center justify-between">
            <component :is="icon" class="h-5 w-5 text-primary" aria-hidden="true" />
            <span v-if="highlight" class="text-lg font-semibold text-primary">{{ highlight }}</span>
        </div>
        <h2 class="text-lg font-semibold text-slate-900">{{ title }}</h2>
        <p class="text-sm text-slate-700">{{ desc }}</p>
    </div>
</template>
