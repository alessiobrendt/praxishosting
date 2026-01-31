<script setup lang="ts">
import { ref } from 'vue';

defineProps<{
    question: string;
    answer: string;
}>();

const open = ref(false);
</script>

<template>
    <div class="rounded-lg border bg-white">
        <button
            type="button"
            class="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium text-slate-900 hover:bg-slate-50"
            @click="open = !open"
        >
            <span>{{ question }}</span>
            <span class="text-slate-500">{{ open ? '−' : '+' }}</span>
        </button>
        <div v-show="open" class="border-t px-4 py-3 text-sm text-slate-700">
            {{ answer }}
        </div>
    </div>
</template>
