<script setup lang="ts">
import AppLogoIcon from '@/components/AppLogoIcon.vue';
</script>

<template>
    <div class="flex items-center gap-2">
        <div
            class="flex shrink-0 aspect-square size-8 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground"
        >
            <AppLogoIcon class="size-5 fill-current text-white dark:text-black" />
        </div>
        <div class="ml-1 grid min-w-0 flex-1 text-left text-sm">
            <span class="mb-0.5 truncate leading-tight font-semibold">
                Laravel Starter Kit
            </span>
        </div>
    </div>
</template>
