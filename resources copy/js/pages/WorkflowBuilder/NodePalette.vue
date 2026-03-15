<script setup lang="ts">
import type { NodeTypeDef } from '@/types/workflow';

defineProps<{
    nodeTypes: NodeTypeDef[];
}>();

const emit = defineEmits<{
    (e: 'add', def: NodeTypeDef): void;
}>();
</script>

<template>
    <div class="space-y-4">
        <div>
            <h3 class="text-sm font-semibold text-gray-900 dark:text-gray-100">
                Bausteine (aus eurer PDF)
            </h3>
            <p class="mt-1.5 text-xs text-gray-600 dark:text-gray-400">
                Klick auf einen Baustein → Node wird auf der Fläche angelegt.
            </p>
        </div>
        <div class="grid gap-2.5">
            <button
                v-for="def in nodeTypes"
                :key="def.type"
                type="button"
                class="workflow-palette-tile"
                @click="emit('add', def)"
            >
                <span class="font-semibold text-[13px] text-gray-900 dark:text-gray-100">{{ def.label }}</span>
                <span class="mt-0.5 block text-xs text-gray-600 dark:text-gray-400">
                    {{ def.desc }}
                </span>
            </button>
        </div>
    </div>
</template>
