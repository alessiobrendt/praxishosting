<script setup lang="ts">
import { computed, ref, watch, provide, nextTick } from 'vue';
import { acceptsChildren } from '@/templates/handyso/combined-registry';
import type { LayoutComponentEntry } from '@/types/layout-components';
import type { LayoutComponentType } from '@/types/layout-components';
import LayoutBlock from '@/templates/handyso/LayoutBlock.vue';
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
        insertAtRoot?: (index: number, type: string) => void;
        insertAtParent?: (parentId: string, index: number, type: string) => void;
    }>(),
    { generalInformation: () => ({}), designMode: false, onSelect: undefined, selectedModuleId: null, insertAtRoot: undefined, insertAtParent: undefined },
);

const emit = defineEmits<{
    (e: 'select', id: string): void;
    (e: 'reorder', tree: LayoutComponentEntry[]): void;
    (e: 'dragStart'): void;
}>();

function isValidEntry(e: unknown): e is LayoutComponentEntry {
    return (
        e !== null &&
        typeof e === 'object' &&
        typeof (e as LayoutComponentEntry).id === 'string' &&
        typeof (e as LayoutComponentEntry).type === 'string'
    );
}

function cloneDeepAndNormalize(entries: LayoutComponentEntry[]): LayoutComponentEntry[] {
    return entries.filter(isValidEntry).map((e) => {
        const cloned: LayoutComponentEntry = {
            id: e.id,
            type: e.type,
            data: { ...(e.data ?? {}) },
        };
        if (acceptsChildren(e.type as LayoutComponentType)) {
            const raw = e.children;
            cloned.children = Array.isArray(raw) ? cloneDeepAndNormalize(raw.filter(isValidEntry)) : [];
        }
        return cloned;
    });
}

function onSectionClick(moduleId: string): void {
    if (!props.designMode) return;
    emit('select', moduleId);
    props.onSelect?.(moduleId);
    try {
        if (typeof window.parent !== 'undefined') {
            window.parent.postMessage({ type: 'page-designer-select', moduleId }, '*');
        }
    } catch {
        // cross-origin or unavailable
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

// Sync from parent to localTree only; never emit from here to avoid crash when adding slot sections (e.g. Feature-Angebote)
watch(
    layoutComponents,
    (val) => {
        const cloned = cloneDeepAndNormalize(val);
        nextTick(() => {
            localTree.value = cloned;
        });
    },
    { immediate: true, deep: true, flush: 'post' },
);

function onReorder(): void {
    emit('reorder', JSON.parse(JSON.stringify(localTree.value)));
}

provide('designMode', computed(() => props.designMode ?? false));
provide('site', computed(() => props.site));
provide('generalInformation', computed(() => props.generalInformation ?? {}));

const dropTargetIndex = ref<number | null>(null);

function onDropZoneDragOver(index: number, e: DragEvent): void {
    e.preventDefault();
    e.dataTransfer ??= new DataTransfer();
    e.dataTransfer.dropEffect = 'copy';
    dropTargetIndex.value = index;
}

function onDropZoneDragLeave(): void {
    dropTargetIndex.value = null;
}

function onDropZoneDrop(index: number, e: DragEvent): void {
    e.preventDefault();
    dropTargetIndex.value = null;
    const type = e.dataTransfer?.getData('component-type');
    if (type && props.insertAtRoot) {
        props.insertAtRoot(index, type);
    }
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
                    class="flex flex-col"
                    ghost-class="opacity-50"
                    :revert-on-spill="true"
                    @start="emit('dragStart')"
                    @end="onReorder"
                >
                    <template #item="{ element: entry, index }">
                        <div class="flex flex-col">
                            <div
                                v-if="insertAtRoot"
                                class="min-h-2.5 shrink-0 border border-dashed border-transparent transition-colors"
                                :class="{ 'border-[#fd7f2b] bg-[#fd7f2b]/10': dropTargetIndex === index }"
                                @dragover="onDropZoneDragOver(index, $event)"
                                @dragleave="onDropZoneDragLeave"
                                @drop="onDropZoneDrop(index, $event)"
                            >
                                <span class="sr-only">Komponente vor diesem Block einfügen</span>
                            </div>
                        <LayoutBlock
                            :entry="entry"
                            :design-mode="true"
                            :selected-module-id="selectedModuleId"
                            :insert-at-parent="insertAtParent"
                            @select="onSectionClick"
                            @reorder="onReorder"
                            @drag-start="emit('dragStart')"
                        />
                        </div>
                    </template>
                </draggable>
                <div
                    v-if="insertAtRoot"
                    class="min-h-4 shrink-0 flex-1 border border-dashed border-transparent transition-colors"
                    :class="{ 'border-[#fd7f2b] bg-[#fd7f2b]/10': dropTargetIndex === localTree.length }"
                    :data-drop-index="localTree.length"
                    @dragover="onDropZoneDragOver(localTree.length, $event)"
                    @dragleave="onDropZoneDragLeave"
                    @drop="onDropZoneDrop(localTree.length, $event)"
                >
                    <span class="sr-only">Komponente am Ende einfügen</span>
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
