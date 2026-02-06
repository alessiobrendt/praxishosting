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
    <h2 class="max-w-xs text-center text-xl font-bold leading-snug text-white lg:text-2xl">
        {{ text() }}
    </h2>
</template>
