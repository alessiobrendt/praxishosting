<script setup lang="ts">
const props = withDefaults(
    defineProps<{
        data: Record<string, unknown>;
        designMode?: boolean;
    }>(),
    { designMode: false },
);
const text = () => (props.data?.text as string) ?? '';
</script>

<template>
    <h1 class="text-3xl font-bold leading-tight text-white sm:text-4xl @sm:text-4xl lg:text-5xl @lg:text-5xl">
        {{ text() }}
    </h1>
</template>
