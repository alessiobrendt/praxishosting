<script setup lang="ts">
import { ChevronRight } from 'lucide-vue-next';

const props = withDefaults(
    defineProps<{
        data: Record<string, unknown>;
        designMode?: boolean;
    }>(),
    { designMode: false },
);
const text = () => (props.data?.text as string) ?? 'Learn More';
const href = () => (props.data?.href as string) ?? '#';
</script>

<template>
    <a
        :href="designMode ? '#' : href()"
        class="mt-6 inline-flex w-fit items-center gap-2 rounded bg-[#fd7f2b] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#e67220]"
        @click="designMode && $event.preventDefault()"
    >
        {{ text() }}
        <ChevronRight class="h-4 w-4" />
    </a>
</template>
