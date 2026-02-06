<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import type { LayoutComponentEntry } from '@/types/layout-components';
import {
    treeToFlat,
    flatToTree,
    normalizeDepthsAfterDrop,
    getSubtreeSlice,
} from '@/lib/layout-tree';
import type { FlatEntry } from '@/lib/layout-tree';
import draggable from 'vuedraggable';
import { Button } from '@/components/ui/button';
import {
    GripVertical,
    Copy,
    Trash2,
    ChevronRight,
    ChevronDown,
    Layers,
    Box,
    Image,
    Type,
    PanelTop,
} from 'lucide-vue-next';

interface VisibleItem {
    flatItem: FlatEntry;
    flatIndex: number;
}

const props = withDefaults(
    defineProps<{
        list: LayoutComponentEntry[];
        getComponentLabel: (type: string, entry?: { data?: Record<string, unknown> }) => string;
        selectedModuleId: string | null;
        getAcceptsChildren?: (type: string) => boolean;
    }>(),
    { getAcceptsChildren: undefined },
);

const emit = defineEmits<{
    (e: 'update:list', value: LayoutComponentEntry[]): void;
    (e: 'select', id: string): void;
    (e: 'remove', flatIndex: number): void;
    (e: 'duplicate', flatIndex: number): void;
    (e: 'move', flatIndex: number, direction: 'up' | 'down'): void;
}>();

const localFlat = ref<FlatEntry[]>([]);

/** IDs of nodes that are collapsed (children hidden). */
const collapsedIds = ref<Set<string>>(new Set());

watch(
    () => [props.list, props.getAcceptsChildren],
    () => {
        localFlat.value = treeToFlat(
            Array.isArray(props.list) ? props.list : [],
            0,
            props.getAcceptsChildren,
        );
    },
    { immediate: true, deep: true },
);

/** Whether the node at flatIndex is visible (no ancestor is collapsed). */
function isVisible(flatIndex: number): boolean {
    const flat = localFlat.value;
    const item = flat[flatIndex];
    if (!item) return true;
    let itemDepth = item.depth;
    for (let j = flatIndex - 1; j >= 0; j--) {
        const d = flat[j].depth;
        if (d < itemDepth) {
            if (collapsedIds.value.has(flat[j].entry.id)) return false;
            itemDepth = d;
            if (d === 0) break;
        }
    }
    return true;
}

/** Only visible items, in flat order. Drag reorders this list only. */
const visibleList = computed((): VisibleItem[] => {
    const flat = localFlat.value;
    const out: VisibleItem[] = [];
    for (let i = 0; i < flat.length; i++) {
        if (isVisible(i)) out.push({ flatItem: flat[i], flatIndex: i });
    }
    return out;
});

/** Reorderable list of visible items; synced from visibleList when tree or collapse changes. */
const reorderedVisible = ref<VisibleItem[]>([]);

watch(
    visibleList,
    (val) => {
        reorderedVisible.value = val.map((x) => ({ ...x }));
    },
    { immediate: true },
);

function onDragEnd(): void {
    const flat = localFlat.value;
    const newFlat = reorderedVisible.value.flatMap(({ flatIndex }) =>
        getSubtreeSlice(flat, flatIndex),
    );
    const normalized = normalizeDepthsAfterDrop(newFlat, props.getAcceptsChildren);
    emit('update:list', flatToTree(normalized, props.getAcceptsChildren));
}

function toggleCollapsed(id: string): void {
    const next = new Set(collapsedIds.value);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    collapsedIds.value = next;
}

/** Whether the node at flatIndex has children (next item has greater depth). */
function hasChildren(flatIndex: number): boolean {
    const flat = localFlat.value;
    if (flatIndex + 1 >= flat.length) return false;
    return flat[flatIndex + 1].depth > flat[flatIndex].depth;
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

/** Index in reorderedVisible for the item with this flatIndex (for disable up/down). */
function visibleIndexForFlatIndex(flatIndex: number): number {
    return reorderedVisible.value.findIndex((x) => x.flatIndex === flatIndex);
}

/** Icon component for entry type (container vs content). */
function getIcon(flatItem: FlatEntry): typeof Layers {
    const acc = props.getAcceptsChildren?.(flatItem.entry.type);
    if (acc) return Layers;
    const t = flatItem.entry.type?.toLowerCase() ?? '';
    if (t.includes('image') || (t.includes('hero') && t.includes('image'))) return Image;
    if (t.includes('text') || t.includes('heading') || t.includes('subheading')) return Type;
    if (t.includes('section') || t.includes('grid') || t.includes('flex')) return PanelTop;
    return Box;
}
</script>

<template>
    <div class="space-y-0.5">
        <draggable
            v-model="reorderedVisible"
            item-key="flatItem.entry.id"
            handle=".drag-handle"
            :group="{ name: 'layout-blocks', pull: true, put: true }"
            ghost-class="sidebar-tree-ghost"
            class="flex flex-col gap-0.5"
            :animation="180"
            @end="onDragEnd"
        >
            <template #item="{ element: item }">
                <div
                    :class="[
                        'flex items-center gap-1 rounded-md border py-0.5 pl-1.5 pr-1 transition-colors',
                        selectedModuleId === item.flatItem.entry.id
                            ? 'border-primary bg-primary/10 ring-1 ring-primary/30'
                            : 'border-border hover:bg-muted/50',
                        item.flatItem.depth > 0 && 'border-l-2 border-l-muted-foreground/30',
                    ]"
                    :style="{
                        marginLeft: item.flatItem.depth > 0 ? `${item.flatItem.depth * 1.25}rem` : 0,
                    }"
                >
                    <button
                        v-if="getAcceptsChildren?.(item.flatItem.entry.type) && hasChildren(item.flatIndex)"
                        type="button"
                        class="flex h-7 w-5 shrink-0 items-center justify-center rounded text-muted-foreground hover:bg-muted hover:text-foreground"
                        :aria-label="collapsedIds.has(item.flatItem.entry.id) ? 'Aufklappen' : 'Zuklappen'"
                        @click.stop="toggleCollapsed(item.flatItem.entry.id)"
                    >
                        <ChevronDown
                            v-if="!collapsedIds.has(item.flatItem.entry.id)"
                            class="h-3.5 w-3.5"
                        />
                        <ChevronRight
                            v-else
                            class="h-3.5 w-3.5"
                        />
                    </button>
                    <span
                        v-else
                        class="w-5 shrink-0"
                        aria-hidden
                    />
                    <GripVertical
                        class="drag-handle h-4 w-4 shrink-0 cursor-grab text-muted-foreground active:cursor-grabbing"
                        aria-hidden
                    />
                    <component
                        :is="getIcon(item.flatItem)"
                        class="h-4 w-4 shrink-0 text-muted-foreground"
                        aria-hidden
                    />
                    <button
                        type="button"
                        class="min-w-0 flex-1 truncate py-1.5 pl-1 text-left text-sm font-medium hover:underline"
                        @click="emit('select', item.flatItem.entry.id)"
                    >
                        {{ getComponentLabel(item.flatItem.entry.type, item.flatItem.entry) }}
                    </button>
                    <div class="flex shrink-0 gap-0.5">
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            class="h-7 w-7"
                            :disabled="visibleIndexForFlatIndex(item.flatIndex) === 0"
                            aria-label="Nach oben"
                            @click="handleMoveAt(item.flatIndex, 'up')"
                        >
                            <span class="text-xs">↑</span>
                        </Button>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            class="h-7 w-7"
                            :disabled="visibleIndexForFlatIndex(item.flatIndex) === reorderedVisible.length - 1"
                            aria-label="Nach unten"
                            @click="handleMoveAt(item.flatIndex, 'down')"
                        >
                            <span class="text-xs">↓</span>
                        </Button>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            class="h-7 w-7"
                            aria-label="Duplizieren"
                            @click="handleDuplicateAt(item.flatIndex)"
                        >
                            <Copy class="h-3.5 w-3.5" />
                        </Button>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            class="h-7 w-7 text-destructive"
                            aria-label="Entfernen"
                            @click="handleRemoveAt(item.flatIndex)"
                        >
                            <Trash2 class="h-3.5 w-3.5" />
                        </Button>
                    </div>
                </div>
            </template>
        </draggable>
    </div>
</template>

<style scoped>
.sidebar-tree-ghost {
    opacity: 0.6;
    background-color: var(--muted);
}
</style>
