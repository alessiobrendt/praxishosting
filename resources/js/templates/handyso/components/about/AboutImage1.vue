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
    <div class="relative aspect-[4/3] overflow-hidden rounded-lg">
        <img
            v-if="src()"
            :src="src()"
            :alt="alt()"
            class="h-full w-full object-cover"
        />
        <div v-else class="flex h-full w-full items-center justify-center bg-gray-200 text-gray-500">
            Bild 1
        </div>
    </div>
</template>
