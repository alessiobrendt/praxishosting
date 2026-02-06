<script setup lang="ts">
import { computed } from 'vue';
import { Wrench, Calendar, ShieldCheck } from 'lucide-vue-next';
import type { Component } from 'vue';

const props = withDefaults(
    defineProps<{
        data: Record<string, unknown>;
        designMode?: boolean;
    }>(),
    { designMode: false },
);

const icon = () => (props.data?.icon as string) ?? 'Wrench';
const title = () => (props.data?.title as string) ?? '';
const desc = () => (props.data?.desc as string) ?? '';

const iconMap: Record<string, Component> = {
    Wrench,
    Calendar,
    ShieldCheck,
};
const iconComponent = computed(() => iconMap[icon()] ?? Wrench);
</script>

<template>
    <div class="flex flex-col rounded-t-2xl bg-white p-6 shadow-sm">
        <component :is="iconComponent" class="h-10 w-10 shrink-0 text-gray-400" />
        <h3 class="mt-3 text-lg font-semibold text-[#fd7f2b]">{{ title() }}</h3>
        <p class="mt-2 text-sm text-gray-600">{{ desc() }}</p>
    </div>
</template>
