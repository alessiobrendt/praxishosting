<script setup lang="ts">
import { ref, watch } from 'vue';
import type { LayoutComponentEntry } from '@/types/layout-components';
import { treeToFlat, flatToTree, normalizeDepthsAfterDrop } from '@/lib/layout-tree';
import type { FlatEntry } from '@/lib/layout-tree';
import draggable from 'vuedraggable';
import { Button } from '@/components/ui/button';
import { GripVertical, Copy, Trash2 } from 'lucide-vue-next';

const props = defineProps<{
    list: LayoutComponentEntry[];
    getComponentLabel: (type: string, entry?: { data?: Record<string, unknown> }) => string;
    selectedModuleId: string | null;
}>();

const emit = defineEmits<{
    (e: 'update:list', value: LayoutComponentEntry[]): void;
    (e: 'select', id: string): void;
    (e: 'remove', flatIndex: number): void;
    (e: 'duplicate', flatIndex: number): void;
    (e: 'move', flatIndex: number, direction: 'up' | 'down'): void;
}>();

const localFlat = ref<FlatEntry[]>([]);

watch(
    () => props.list,
    (val) => {
        localFlat.value = treeToFlat(Array.isArray(val) ? val : []);
    },
    { immediate: true, deep: true },
);

function onDragEnd(): void {
    const normalized = normalizeDepthsAfterDrop(localFlat.value);
    emit('update:list', flatToTree(normalized));
}

function handleRemoveAt(flatIndex: number): void {
    emit('remove', flatIndex);
}

function handleDuplicateAt(flatIndex: number): void {
    emit('duplicate', flatIndex);
}

function handleMoveAt(flatIndex: number, direction: 'up' | 'down'): void {
    emit('move', flatIndex, direction);
}
</script>

<template>
    <draggable
        v-model="localFlat"
        item-key="entry.id"
        handle=".drag-handle"
        :group="{ name: 'layout-blocks', pull: true, put: true }"
        class="space-y-1"
        ghost-class="opacity-50"
        :revert-on-spill="true"
        @end="onDragEnd"
    >
        <template #item="{ element: flatItem, index }">
            <div
                class="flex items-center gap-1 rounded border p-2 text-sm"
                :class="{ 'ring-2 ring-primary': selectedModuleId === flatItem.entry.id }"
                :style="{
                    marginLeft: flatItem.depth > 0 ? `${flatItem.depth * 1.25}rem` : 0,
                    borderLeft: flatItem.depth > 0 ? '1px solid var(--border)' : 'none',
                    paddingLeft: flatItem.depth > 0 ? '0.375rem' : undefined,
                }"
            >
                <GripVertical
                    class="drag-handle h-4 w-4 shrink-0 cursor-grab text-muted-foreground active:cursor-grabbing"
                    aria-hidden
                />
                <button
                    type="button"
                    class="min-w-0 flex-1 truncate text-left font-medium hover:underline"
                    @click="emit('select', flatItem.entry.id)"
                >
                    {{ getComponentLabel(flatItem.entry.type, flatItem.entry) }}
                </button>
                <div class="flex shrink-0 gap-0.5">
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        class="h-7 w-7"
                        :disabled="index === 0"
                        :aria-label="'Nach oben'"
                        @click="handleMoveAt(index, 'up')"
                    >
                        <span class="text-xs">↑</span>
                    </Button>
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        class="h-7 w-7"
                        :disabled="index === localFlat.length - 1"
                        :aria-label="'Nach unten'"
                        @click="handleMoveAt(index, 'down')"
                    >
                        <span class="text-xs">↓</span>
                    </Button>
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        class="h-7 w-7"
                        :aria-label="'Duplizieren'"
                        @click="handleDuplicateAt(index)"
                    >
                        <Copy class="h-3.5 w-3.5" />
                    </Button>
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        class="h-7 w-7 text-destructive"
                        :aria-label="'Entfernen'"
                        @click="handleRemoveAt(index)"
                    >
                        <Trash2 class="h-3.5 w-3.5" />
                    </Button>
                </div>
            </div>
        </template>
    </draggable>
</template>
