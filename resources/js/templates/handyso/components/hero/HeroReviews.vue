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
    <p v-if="text()" class="mt-8 flex items-center gap-2 text-sm text-white/90">
        <span class="flex -space-x-2">
            <span class="h-8 w-8 rounded-full border-2 border-[#010b1a] bg-gray-500" />
            <span class="h-8 w-8 rounded-full border-2 border-[#010b1a] bg-gray-600" />
            <span class="h-8 w-8 rounded-full border-2 border-[#010b1a] bg-gray-700" />
        </span>
        <span class="ml-1">+</span>
        {{ text() }}
    </p>
</template>
