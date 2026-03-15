<script setup lang="ts">
import { Link } from '@inertiajs/vue3';

interface Props {
    title: string;
    subtitle?: string;
    /** Breadcrumb-Items (optional); falls nicht gesetzt, wird nur subtitle > title angezeigt */
    breadcrumbs?: { title: string; href?: string }[];
}

withDefaults(defineProps<Props>(), {
    subtitle: undefined,
    breadcrumbs: () => [],
});
</script>

<template>
    <div class="page-title-head">
        <h4 class="page-main-title">{{ title }}</h4>
        <div v-if="breadcrumbs.length > 0 || subtitle" class="hidden items-center gap-1.5 text-sm md:flex">
            <Link href="/" class="text-sm">Dashboard</Link>
            <template v-if="breadcrumbs.length">
                <template v-for="(crumb, i) in breadcrumbs" :key="i">
                    <span class="text-default-400" aria-hidden="true">/</span>
                    <Link
                        v-if="crumb.href && i < breadcrumbs.length - 1"
                        :href="crumb.href"
                        class="text-sm"
                    >
                        {{ crumb.title }}
                    </Link>
                    <span
                        v-else
                        :class="['text-sm', i === breadcrumbs.length - 1 ? 'text-default-400' : '']"
                        :aria-current="i === breadcrumbs.length - 1 ? 'page' : undefined"
                    >
                        {{ crumb.title }}
                    </span>
                </template>
            </template>
            <template v-else-if="subtitle">
                <span class="text-default-400" aria-hidden="true">/</span>
                <span class="text-sm">{{ subtitle }}</span>
                <span class="text-default-400" aria-hidden="true">/</span>
                <span class="text-default-400 text-sm" aria-current="page">{{ title }}</span>
            </template>
        </div>
    </div>
</template>
