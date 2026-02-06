<script setup lang="ts">
const props = withDefaults(
    defineProps<{
        data: Record<string, unknown>;
        designMode?: boolean;
    }>(),
    { designMode: false },
);
const text = () => (props.data?.text as string) ?? 'More About Us';
const href = () => (props.data?.href as string) ?? '#';
</script>

<template>
    <a
        :href="designMode ? '#' : href()"
        class="mt-8 inline-flex w-fit rounded bg-[#fd7f2b] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#e67220]"
        @click="designMode && $event.preventDefault()"
    >
        {{ text() }}
    </a>
</template>
