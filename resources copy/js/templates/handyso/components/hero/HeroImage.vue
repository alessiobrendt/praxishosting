<script setup lang="ts">
const props = withDefaults(
    defineProps<{
        data: Record<string, unknown>;
        designMode?: boolean;
    }>(),
    { designMode: false },
);
const src = () => (props.data?.src as string) ?? '';
const alt = () => (props.data?.alt as string) ?? '';
</script>

<template>
    <img
        v-if="src()"
        :src="src()"
        :alt="alt()"
        class="absolute inset-0 h-full w-full object-cover opacity-60"
    />
</template>
