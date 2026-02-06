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
    <span
        v-if="text()"
        class="inline-block w-fit bg-[#fd7f2b] px-3 py-1 text-sm font-medium text-white"
    >
        {{ text() }}
    </span>
</template>
