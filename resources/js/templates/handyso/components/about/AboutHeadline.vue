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
    <h2 class="mt-3 text-2xl font-bold text-gray-900 sm:text-3xl">
        {{ text() }}
    </h2>
</template>
