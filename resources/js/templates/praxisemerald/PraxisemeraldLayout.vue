<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { acceptsChildren } from '@/templates/praxisemerald/component-registry';
import type { LayoutComponentEntry } from '@/types/layout-components';
import type { LayoutComponentType } from '@/types/layout-components';
import LayoutBlock from '@/templates/praxisemerald/LayoutBlock.vue';
import draggable from 'vuedraggable';

const props = withDefaults(
    defineProps<{
        pageData: Record<string, unknown>;
        colors: Record<string, string>;
        generalInformation?: Record<string, unknown>;
        site: { id: number; name: string; slug: string };
        designMode?: boolean;
        onSelect?: (id: string) => void;
        selectedModuleId?: string | null;
    }>(),
    { generalInformation: () => ({}), designMode: false, onSelect: undefined, selectedModuleId: null },
);

const emit = defineEmits<{
    (e: 'select', id: string): void;
    (e: 'reorder', tree: LayoutComponentEntry[]): void;
}>();

function cloneDeepAndNormalize(entries: LayoutComponentEntry[]): LayoutComponentEntry[] {
    return entries.map((e) => {
        const cloned: LayoutComponentEntry = {
            id: e.id,
            type: e.type,
            data: { ...(e.data ?? {}) },
        };
        if (acceptsChildren(e.type as LayoutComponentType)) {
            const raw = e.children;
            cloned.children = Array.isArray(raw) ? cloneDeepAndNormalize(raw) : [];
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

watch(
    layoutComponents,
    (val) => {
        localTree.value = cloneDeepAndNormalize(val);
    },
    { immediate: true },
);

function onReorder(): void {
    emit('reorder', JSON.parse(JSON.stringify(localTree.value)));
}
</script>

<template>
    <div class="flex min-h-screen flex-col">
        <template v-if="designMode">
            <draggable
                v-model="localTree"
                item-key="id"
                handle=".block-drag-handle"
                :group="'layout-blocks'"
                class="flex min-h-screen flex-col"
                ghost-class="opacity-50"
                @end="onReorder"
            >
                <template #item="{ element: entry }">
                    <LayoutBlock
                        :entry="entry"
                        :design-mode="true"
                        :selected-module-id="selectedModuleId"
                        @select="onSectionClick"
                        @reorder="onReorder"
                    />
                </template>
            </draggable>
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
