<script setup lang="ts">
import { ref, watch } from 'vue';
import type { LayoutComponentEntry } from '@/types/layout-components';
import type { LayoutComponentType } from '@/types/layout-components';
import { acceptsChildren } from '@/templates/praxisemerald/component-registry';
import draggable from 'vuedraggable';
import { Button } from '@/components/ui/button';
import { GripVertical, Copy, Trash2 } from 'lucide-vue-next';

const props = withDefaults(
    defineProps<{
        list: LayoutComponentEntry[];
        getComponentLabel: (type: string) => string;
        selectedModuleId: string | null;
        removeAt: (list: LayoutComponentEntry[], index: number) => void;
        duplicateAt: (list: LayoutComponentEntry[], index: number) => void;
        moveAt: (list: LayoutComponentEntry[], index: number, direction: 'up' | 'down') => void;
        depth?: number;
    }>(),
    { depth: 0 },
);

const emit = defineEmits<{
    (e: 'update:list', value: LayoutComponentEntry[]): void;
    (e: 'select', id: string): void;
}>();

const localList = ref<LayoutComponentEntry[]>([]);

watch(
    () => props.list,
    (val) => {
        localList.value = Array.isArray(val) ? [...val] : [];
    },
    { immediate: true, deep: true },
);

function onListUpdate(): void {
    emit('update:list', [...localList.value]);
}

function getChildren(entry: LayoutComponentEntry): LayoutComponentEntry[] {
    if (!acceptsChildren(entry.type as LayoutComponentType)) return [];
    const c = entry.children;
    return Array.isArray(c) ? c : [];
}

function isContainer(entry: LayoutComponentEntry): boolean {
    return acceptsChildren(entry.type as LayoutComponentType);
}

function setChildren(entry: LayoutComponentEntry, v: LayoutComponentEntry[]): void {
    entry.children = v;
}

function handleRemoveAt(list: LayoutComponentEntry[], index: number): void {
    props.removeAt(list, index);
    onListUpdate();
}

function handleDuplicateAt(list: LayoutComponentEntry[], index: number): void {
    props.duplicateAt(list, index);
    onListUpdate();
}

function handleMoveAt(list: LayoutComponentEntry[], index: number, direction: 'up' | 'down'): void {
    props.moveAt(list, index, direction);
    onListUpdate();
}
</script>

<template>
    <draggable
        v-model="localList"
        item-key="id"
        handle=".drag-handle"
        :group="'layout-blocks'"
        class="space-y-1"
        :class="{ 'ml-3 border-l-2 border-muted pl-2': depth > 0 }"
        ghost-class="opacity-50"
        @end="onListUpdate"
    >
        <template #item="{ element: entry, index }">
            <div class="flex min-h-0 flex-col">
                <div
                    class="flex items-center gap-1 rounded border p-2 text-sm"
                    :class="{ 'ring-2 ring-primary': selectedModuleId === entry.id }"
                >
                    <GripVertical
                        class="drag-handle h-4 w-4 shrink-0 cursor-grab text-muted-foreground active:cursor-grabbing"
                        aria-hidden
                    />
                    <button
                        type="button"
                        class="min-w-0 flex-1 truncate text-left font-medium hover:underline"
                        @click="emit('select', entry.id)"
                    >
                        {{ getComponentLabel(entry.type) }}
                    </button>
                    <div class="flex shrink-0 gap-0.5">
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            class="h-7 w-7"
                            :disabled="index === 0"
                            :aria-label="'Nach oben'"
                            @click="handleMoveAt(localList, index, 'up')"
                        >
                            <span class="text-xs">↑</span>
                        </Button>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            class="h-7 w-7"
                            :disabled="index === localList.length - 1"
                            :aria-label="'Nach unten'"
                            @click="handleMoveAt(localList, index, 'down')"
                        >
                            <span class="text-xs">↓</span>
                        </Button>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            class="h-7 w-7"
                            :aria-label="'Duplizieren'"
                            @click="handleDuplicateAt(localList, index)"
                        >
                            <Copy class="h-3.5 w-3.5" />
                        </Button>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            class="h-7 w-7 text-destructive"
                            :aria-label="'Entfernen'"
                            @click="handleRemoveAt(localList, index)"
                        >
                            <Trash2 class="h-3.5 w-3.5" />
                        </Button>
                    </div>
                </div>
                <SidebarTreeLevel
                    v-if="isContainer(entry)"
                    :list="getChildren(entry)"
                    :get-component-label="getComponentLabel"
                    :selected-module-id="selectedModuleId"
                    :remove-at="removeAt"
                    :duplicate-at="duplicateAt"
                    :move-at="moveAt"
                    :depth="depth + 1"
                    @update:list="(v) => setChildren(entry, v)"
                    @select="(id) => emit('select', id)"
                />
            </div>
        </template>
    </draggable>
</template>
