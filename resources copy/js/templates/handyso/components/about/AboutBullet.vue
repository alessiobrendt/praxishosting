<script setup lang="ts">
import { Check } from 'lucide-vue-next';

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
    <li class="flex items-center gap-2 text-gray-700">
        <span class="flex h-5 w-5 shrink-0 items-center justify-center bg-[#fd7f2b] text-white">
            <Check class="h-3 w-3" />
        </span>
        {{ text() }}
    </li>
</template>
