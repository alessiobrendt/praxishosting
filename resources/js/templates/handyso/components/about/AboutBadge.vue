<script setup lang="ts">
const props = withDefaults(
    defineProps<{
        data: Record<string, unknown>;
        designMode?: boolean;
    }>(),
    { designMode: false },
);
const number = () => (props.data?.number as string) ?? '30+';
const label = () => (props.data?.label as string) ?? 'Years of Experience';
</script>

<template>
    <div class="rounded-lg bg-[#010b1a] px-6 py-4 text-white shadow-lg">
        <span class="text-3xl font-bold">{{ number() }}</span>
        <span class="ml-2 text-sm">{{ label() }}</span>
    </div>
</template>
