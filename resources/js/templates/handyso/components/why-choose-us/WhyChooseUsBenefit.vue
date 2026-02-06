<script setup lang="ts">
import { computed } from 'vue';
import { Wrench, Handshake, CheckCircle, Clock } from 'lucide-vue-next';
import type { Component } from 'vue';

const props = withDefaults(
    defineProps<{
        data: Record<string, unknown>;
        designMode?: boolean;
    }>(),
    { designMode: false },
);

const icon = () => (props.data?.icon as string) ?? 'CheckCircle';
const title = () => (props.data?.title as string) ?? '';

const iconMap: Record<string, Component> = {
    Wrench,
    Handshake,
    CheckCircle,
    Clock,
};
const iconComponent = computed(() => iconMap[icon()] ?? CheckCircle);
</script>

<template>
    <div class="flex items-start gap-4 rounded-lg bg-white p-6 shadow-sm">
        <component :is="iconComponent" class="h-10 w-10 shrink-0 text-[#fd7f2b]" />
        <h3 class="font-semibold text-gray-900">{{ title() }}</h3>
    </div>
</template>
