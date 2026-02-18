<script setup lang="ts">
import { computed, ref, watch, provide, nextTick } from 'vue';
import { acceptsChildren } from '@/templates/praxisemerald/combined-registry';
import { normalizeLayoutTree } from '@/lib/layout-tree';
import type { LayoutComponentEntry, LayoutComponentType } from '@/types/layout-components';
import LayoutBlock from '@/templates/praxisemerald/LayoutBlock.vue';
import draggable from 'vuedraggable';

const props = withDefaults(
    defineProps<{
        pageData: Record<string, unknown>;
        colors: Record<string, string>;
        generalInformation?: Record<string, unknown>;
        site?: { id: number; name: string; slug: string };
        designMode?: boolean;
        onSelect?: (id: string) => void;
        selectedModuleId?: string | null;
        selectedBlockIds?: Set<string>;
        moveSelectionToContainer?: (
            containerId: string,
            newChildren: LayoutComponentEntry[],
            currentTree: LayoutComponentEntry[],
        ) => LayoutComponentEntry[];
        moveEntryToContainer?: (
            entryId: string,
            containerId: string,
            index: number,
            currentTree: LayoutComponentEntry[],
        ) => LayoutComponentEntry[];
        insertAtRoot?: (index: number, type: string) => void;
        insertAtParent?: (parentId: string, index: number, type: string) => void;
        /** Global button style from Design tab (variant, radius, size). */
        globalButtonStyle?: { variant?: string; radius?: string; size?: string };
    }>(),
    {
        generalInformation: () => ({}),
        designMode: false,
        onSelect: undefined,
        selectedModuleId: null,
        selectedBlockIds: undefined,
        moveSelectionToContainer: undefined,
        moveEntryToContainer: undefined,
        insertAtRoot: undefined,
        insertAtParent: undefined,
        globalButtonStyle: () => ({}),
    },
);

const emit = defineEmits<{
    (e: 'select', id: string, addToSelection?: boolean): void;
    (e: 'reorder', tree: LayoutComponentEntry[]): void;
    (e: 'dragStart'): void;
}>();

/** True while any layout block is being dragged; prevents watch from overwriting localTree mid-drag. */
const isDragging = ref(false);

/** Entry currently being dragged; used when drop lands on a drop zone so we can move it into the container. */
const lastDraggedEntry = ref<LayoutComponentEntry | null>(null);

function setLastDraggedEntry(entry: LayoutComponentEntry | null): void {
    lastDraggedEntry.value = entry;
}

function addDraggedEntryToContainer(containerId: string, index: number): void {
    const entry = lastDraggedEntry.value;
    const move = props.moveEntryToContainer;
    if (!entry || !move) return;
    const newTree = move(entry.id, containerId, index, localTree.value);
    if (newTree !== localTree.value) {
        localTree.value = newTree;
        scheduleFlushLayout();
    }
    lastDraggedEntry.value = null;
}

function isValidEntry(e: unknown): e is LayoutComponentEntry {
    return (
        e !== null &&
        typeof e === 'object' &&
        typeof (e as LayoutComponentEntry).id === 'string' &&
        typeof (e as LayoutComponentEntry).type === 'string'
    );
}

/** Reject drops from sidebar (VisibleItem) or any non–layout-block shape. */
function isLayoutBlockEntry(el: unknown): el is LayoutComponentEntry {
    if (el == null || typeof el !== 'object') return false;
    const o = el as Record<string, unknown>;
    if (typeof o.id !== 'string' || typeof o.type !== 'string') return false;
    if ('flatItem' in o || 'flatIndex' in o) return false;
    return true;
}

function onRootMove(evt: { draggedContext?: { element?: unknown } }): boolean {
    return isLayoutBlockEntry(evt.draggedContext?.element);
}

/** Clone tree for local editing (no dedupe; dedupe happens on flush). */
function cloneTree(entries: LayoutComponentEntry[]): LayoutComponentEntry[] {
    return entries.filter(isValidEntry).map((e) => {
        const cloned: LayoutComponentEntry = {
            id: e.id,
            type: e.type,
            data: e.data != null && typeof e.data === 'object' ? { ...e.data } : {},
        };
        if (acceptsChildren(e.type as LayoutComponentType)) {
            const raw = e.children;
            cloned.children = Array.isArray(raw) ? cloneTree(raw.filter(isValidEntry) as LayoutComponentEntry[]) : [];
        }
        return cloned;
    });
}

function onSectionClick(moduleId: string, addToSelection?: boolean): void {
    if (!props.designMode) return;
    emit('select', moduleId, addToSelection);
    props.onSelect?.(moduleId);
    try {
        if (typeof window.parent !== 'undefined') {
            window.parent.postMessage({ type: 'page-designer-select', moduleId }, '*');
        }
    } catch {
        // cross-origin or unavailable
    }
}

function addSelectionToContainer(containerId: string, newChildren: LayoutComponentEntry[]): void {
    const move = props.moveSelectionToContainer;
    if (!move) return;
    const newTree = move(containerId, newChildren, localTree.value);
    if (newTree !== localTree.value) {
        localTree.value = newTree;
        scheduleFlushLayout();
    }
}

const layoutComponents = computed((): LayoutComponentEntry[] => {
    const raw = props.pageData?.layout_components;
    if (!Array.isArray(raw)) return [];
    return raw.filter(
        (e): e is LayoutComponentEntry =>
            e && typeof e === 'object' && typeof (e as LayoutComponentEntry).type === 'string' && typeof (e as LayoutComponentEntry).id === 'string',
    );
});

const localTree = ref<LayoutComponentEntry[]>([]);

/** One flush per drag: normalize localTree and emit to store. */
let flushScheduled = false;

function scheduleFlushLayout(): void {
    if (flushScheduled) return;
    flushScheduled = true;
    nextTick(() => {
        nextTick(() => {
            flushScheduled = false;
            const normalized = normalizeLayoutTree(
                localTree.value.filter(isValidEntry) as LayoutComponentEntry[],
                acceptsChildren,
            );
            emit('reorder', normalized);
        });
    });
}

watch(
    layoutComponents,
    (val) => {
        if (isDragging.value) return;
        localTree.value = cloneTree(val);
    },
    { immediate: true, deep: true, flush: 'post' },
);

provide('designMode', computed(() => props.designMode ?? false));
provide('site', computed(() => props.site));
provide('generalInformation', computed(() => props.generalInformation ?? {}));
provide(
    'globalButtonStyle',
    computed(() => props.globalButtonStyle ?? {}),
);
provide('layoutIsDragging', isDragging);
provide('setLayoutDragging', (value: boolean) => {
    isDragging.value = value;
});
provide('addSelectionToContainer', addSelectionToContainer);
provide('selectedBlockIds', computed(() => props.selectedBlockIds ?? new Set()));
provide('lastDraggedEntry', lastDraggedEntry);
provide('setLastDraggedEntry', setLastDraggedEntry);
provide('addDraggedEntryToContainer', addDraggedEntryToContainer);

const dropTargetIndex = ref<number | null>(null);

function onDropZoneDragOver(index: number, e: DragEvent): void {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer ??= new DataTransfer();
    e.dataTransfer.dropEffect = 'move';
    dropTargetIndex.value = index;
}

function onDropZoneDragLeave(e: DragEvent): void {
    if (!(e.currentTarget as HTMLElement)?.contains?.(e.relatedTarget as Node)) {
        dropTargetIndex.value = null;
    }
}

function onDropZoneDrop(index: number, e: DragEvent): void {
    e.preventDefault();
    e.stopPropagation();
    dropTargetIndex.value = null;
    const type = e.dataTransfer?.getData('component-type');
    if (type && props.insertAtRoot) {
        props.insertAtRoot(index, type);
    }
}

function onLayoutDragStart(evt?: { oldIndex?: number }): void {
    isDragging.value = true;
    if (evt?.oldIndex != null && localTree.value[evt.oldIndex]) {
        lastDraggedEntry.value = localTree.value[evt.oldIndex] as LayoutComponentEntry;
    }
    emit('dragStart');
}

function onLayoutDragEnd(): void {
    isDragging.value = false;
    lastDraggedEntry.value = null;
    dropTargetIndex.value = null;
    scheduleFlushLayout();
}
</script>

<template>
    <div class="flex min-h-screen flex-col">
        <template v-if="designMode">
            <div class="flex min-h-screen flex-col">
                <draggable
                    v-model="localTree"
                    item-key="id"
                    handle=".block-drag-handle"
                    :group="{ name: 'layout-blocks', pull: true, put: true }"
                    :move="onRootMove"
                    class="flex flex-col"
                    ghost-class="page-designer-ghost"
                    chosen-class="page-designer-chosen"
                    drag-class="page-designer-drag"
                    :revert-on-spill="true"
                    :animation="200"
                    @start="(evt: { oldIndex?: number }) => onLayoutDragStart(evt)"
                    @end="onLayoutDragEnd"
                >
                    <template #item="{ element: entry, index }">
                        <div class="flex flex-col">
                            <div
                                v-if="insertAtRoot"
                                class="drop-zone shrink-0 rounded transition-all duration-150 min-h-8 border-2 border-dashed flex items-center justify-center"
                                :class="[
                                    dropTargetIndex === index
                                        ? 'border-primary bg-primary/15 ring-2 ring-primary/30'
                                        : 'border-muted-foreground/25 hover:border-muted-foreground/50',
                                    isDragging && 'pointer-events-none',
                                ]"
                                @dragover.prevent.stop="onDropZoneDragOver(index, $event)"
                                @dragleave="onDropZoneDragLeave"
                                @drop.prevent.stop="onDropZoneDrop(index, $event)"
                            >
                                <span v-if="dropTargetIndex === index" class="text-xs font-medium text-primary">Hier einfügen</span>
                                <span v-else class="sr-only">Komponente vor diesem Block einfügen</span>
                            </div>
                        <LayoutBlock
                            :entry="entry"
                            :design-mode="true"
                            :selected-module-id="selectedModuleId"
                            :insert-at-parent="insertAtParent"
                            @select="(id: string, addToSelection?: boolean) => onSectionClick(id, addToSelection)"
                            @reorder="scheduleFlushLayout"
                            @drag-start="onLayoutDragStart"
                        />
                        </div>
                    </template>
                </draggable>
                <div
                    v-if="insertAtRoot"
                    class="drop-zone shrink-0 flex-1 min-h-8 rounded border-2 border-dashed transition-all duration-150 flex items-center justify-center"
                    :class="[
                        dropTargetIndex === localTree.length
                            ? 'border-primary bg-primary/15 ring-2 ring-primary/30'
                            : 'border-muted-foreground/25 hover:border-muted-foreground/50',
                        isDragging && 'pointer-events-none',
                    ]"
                    :data-drop-index="localTree.length"
                    @dragover.prevent.stop="onDropZoneDragOver(localTree.length, $event)"
                    @dragleave="onDropZoneDragLeave"
                    @drop.prevent.stop="onDropZoneDrop(localTree.length, $event)"
                >
                    <span v-if="dropTargetIndex === localTree.length" class="text-xs font-medium text-primary">Hier einfügen</span>
                    <span v-else class="sr-only">Komponente am Ende einfügen</span>
                </div>
            </div>
        </template>
        <template v-else>
            <LayoutBlock
                v-for="entry in layoutComponents"
                :key="entry.id"
                :entry="entry"
            />
        </template>
    </div>
</template>
