<script setup lang="ts">
import { computed } from 'vue';
import { ChevronRight, DoorOpen, Home, Hammer, Zap, Droplets, Paintbrush } from 'lucide-vue-next';
import type { Component } from 'vue';

const props = withDefaults(
    defineProps<{
        data: Record<string, unknown>;
        designMode?: boolean;
    }>(),
    { designMode: false },
);

const icon = () => (props.data?.icon as string) ?? 'Hammer';
const title = () => (props.data?.title as string) ?? '';
const desc = () => (props.data?.desc as string) ?? '';
const readMoreHref = () => (props.data?.readMoreHref as string) ?? '#';


import * as LucideIcons from 'lucide-vue-next';
const invalidIconNames = new Set(['Icon', 'createLucideIcon']);
function iconComponent(name: string) {
    if (invalidIconNames.has(name)) return LucideIcons.Phone;
    const icons = LucideIcons as unknown as Record<string, (typeof LucideIcons)['Phone']>;
    return icons[name] ?? LucideIcons.Phone;
}
</script>

<template>
    <div class="flex flex-col rounded-lg bg-[#010b1a]/90 p-4 text-white">
        <component :is="iconComponent(icon())" class="h-8 w-8 shrink-0 text-[#fd7f2b]" />
        <h3 class="mt-2 text-sm font-semibold">{{ title() }}</h3>
        <p class="mt-1 flex-1 text-xs text-gray-400">{{ desc() }}</p>
        <a v-if="readMoreHref()"
            :href="designMode ? '#' : readMoreHref()"
            class="mt-2 inline-flex items-center gap-1 text-xs font-medium text-[#fd7f2b] hover:underline"
            @click="designMode && $event.preventDefault()"
        >
            Erfahren Sie mehr
            <ChevronRight class="h-3 w-3" />
        </a>
    </div>
</template>
