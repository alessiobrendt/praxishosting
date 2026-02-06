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
    <p v-if="text()" class="mt-4 max-w-xl text-gray-300">
        {{ text() }}
    </p>
</template>
