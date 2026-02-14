<script setup lang="ts">
import { ref, watch, computed, provide, inject, onMounted, onUnmounted, nextTick } from 'vue';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Copy, Trash2, ClipboardPaste } from 'lucide-vue-next';
import { getLayoutComponent } from '@/templates/praxisemerald/component-map';
import { acceptsChildren } from '@/templates/praxisemerald/combined-registry';
import DesignBlock from '@/templates/praxisemerald/DesignBlock.vue';
import { getMotionPreset } from '@/templates/praxisemerald/motion-presets';
import type {
    LayoutComponentEntry,
    SectionJustify,
    SectionAlign,
} from '@/types/layout-components';
import type { LayoutComponentType } from '@/types/layout-components';
import { motion } from 'motion-v';
import draggable from 'vuedraggable';
import { GripVertical } from 'lucide-vue-next';
import ResizeHandle from '@/templates/praxisemerald/components/ResizeHandle.vue';
import { generateResponsiveContainerCSS, hasResponsiveValues } from '@/lib/responsive-styles';

const usePreviewContainerQueries = inject<boolean>('usePreviewContainerQueries', false);

type BlockContextActions = {
    duplicate: (id: string) => void;
    remove: (id: string) => void;
    copy: (id: string) => void;
    paste: (afterId: string) => void;
    getCanPaste: () => boolean;
};
const blockContextActions = inject<{ value: BlockContextActions } | null>('blockContextActions', null);

function isValidContainerChild(e: unknown): e is LayoutComponentEntry {
    return (
        e !== null &&
        typeof e === 'object' &&
        typeof (e as LayoutComponentEntry).id === 'string' &&
        typeof (e as LayoutComponentEntry).type === 'string'
    );
}

const props = withDefaults(
    defineProps<{
        entry: LayoutComponentEntry;
        designMode?: boolean;
        selectedModuleId?: string | null;
        insertAtParent?: (parentId: string, index: number, type: string) => void;
        /** Wenn true, rendert dieser Block keinen eigenen Drag-Handle (wird vom Container-Wrapper bereitgestellt). */
        embeddingProvidesDragHandle?: boolean;
    }>(),
    { designMode: false, selectedModuleId: null, insertAtParent: undefined, embeddingProvidesDragHandle: false },
);

const emit = defineEmits<{
    (e: 'select', id: string): void;
    (e: 'reorder'): void;
    (e: 'dragStart'): void;
}>();

provide('layoutEntry', computed(() => props.entry));

function childEntries(): LayoutComponentEntry[] {
    if (!acceptsChildren(props.entry.type as LayoutComponentType)) return [];
    const c = props.entry.children;
    if (!Array.isArray(c)) return [];
    return c.filter(
        (e): e is LayoutComponentEntry =>
            e && typeof e === 'object' && typeof (e as LayoutComponentEntry).id === 'string' && typeof (e as LayoutComponentEntry).type === 'string',
    );
}

/** Container children array; ensures entry.children is always an array for any container type. */
function getContainerChildren(): LayoutComponentEntry[] {
    if (!acceptsChildren(props.entry.type as LayoutComponentType)) return [];
    let c = props.entry.children;
    if (!Array.isArray(c)) {
        c = [];
        (props.entry as Record<string, unknown>).children = c;
    }
    return c as LayoutComponentEntry[];
}

/** Only valid container children (for display/reorder); invalid entries are not rendered. */
const containerChildrenFiltered = ref<LayoutComponentEntry[]>([]);

watch(
    () => getContainerChildren(),
    (raw) => {
        const filtered = raw.filter(isValidContainerChild);
        // Defer update to avoid race with Vue's patch cycle (parentNode / vnode null errors)
        nextTick(() => {
            containerChildrenFiltered.value = filtered;
        });
    },
    { immediate: true, deep: true, flush: 'post' },
);

function onContainerDragEnd(): void {
    (props.entry as Record<string, unknown>).children = [...containerChildrenFiltered.value];
    nextTick(() => emit('reorder'));
}

const isRow = (): boolean => (props.entry.data?.direction as string) === 'row';

function getChildFlexStyle(child: LayoutComponentEntry): Record<string, string> {
    if (props.entry.type !== 'section' || !isRow()) return { minWidth: '0' };
    const basis = child.data?.flexBasis as string | undefined;
    if (basis) {
        return { flex: `0 0 ${basis}`, minWidth: '0', overflow: 'hidden' };
    }
    return { flex: '1 1 0%', minWidth: '0', overflow: 'hidden' };
}

function onSelect(id: string): void {
    emit('select', id);
}

function getNextChild(index: number): LayoutComponentEntry | undefined {
    return containerChildrenFiltered.value[index + 1];
}

/** Grid/Flex containers: child wrappers use w-full so content fills the cell; Section uses flex-1. */
const isGridOrFlexContainer = (): boolean =>
    props.entry.type === 'grid' || props.entry.type === 'flex';

function mapJustify(v: SectionJustify | string | undefined): string {
    const map: Record<string, string> = {
        start: 'flex-start',
        center: 'center',
        end: 'flex-end',
        'space-between': 'space-between',
        'space-around': 'space-around',
    };
    return map[(v as SectionJustify) ?? 'start'] ?? 'flex-start';
}

function mapAlign(v: SectionAlign | string | undefined): string {
    const map: Record<string, string> = {
        start: 'flex-start',
        center: 'center',
        end: 'flex-end',
        stretch: 'stretch',
    };
    return map[(v as SectionAlign) ?? 'stretch'] ?? 'stretch';
}

const containerUsesResponsiveQueries = computed(
    () =>
        usePreviewContainerQueries &&
        props.designMode &&
        acceptsChildren(props.entry.type as LayoutComponentType) &&
        hasResponsiveValues((props.entry.data ?? {}) as Record<string, unknown>),
);

function getSectionFlexStyle(): Record<string, string> {
    const d = props.entry.data ?? {};
    const style: Record<string, string> = {
        display: 'flex',
        flexWrap: (d.wrap as boolean) !== false ? 'wrap' : 'nowrap',
    };
    if (!containerUsesResponsiveQueries.value) {
        style.flexDirection = (d.direction as string) === 'row' ? 'row' : 'column';
        style.gap = (d.gap as string) ?? '1rem';
        style.justifyContent = mapJustify(d.justify as SectionJustify);
        style.alignItems = mapAlign(d.align as SectionAlign);
    }
    return style;
}

function getGridStyle(): Record<string, string> {
    const d = props.entry.data ?? {};
    const style: Record<string, string> = { display: 'grid' };
    if (!containerUsesResponsiveQueries.value) {
        style.gap = (d.gap as string) ?? '1rem';
        if (d.columns) style.gridTemplateColumns = d.columns as string;
    }
    if (d.rowGap) style.rowGap = d.rowGap as string;
    if (d.columnGap) style.columnGap = d.columnGap as string;
    return style;
}

function getContainerStyle(): Record<string, string> {
    if (props.entry.type === 'grid') {
        return getGridStyle();
    }
    return getSectionFlexStyle();
}

const layoutContainerStyleEl = ref<HTMLStyleElement | null>(null);
const layoutContainerCSS = computed(() => {
    if (!containerUsesResponsiveQueries.value) return '';
    const d = (props.entry.data ?? {}) as Record<string, unknown>;
    const selector = `.layout-block-container-responsive[data-layout-container-id="${props.entry.id}"]`;
    const parts: string[] = [];
    if (props.entry.type === 'grid') {
        parts.push(
            generateResponsiveContainerCSS(selector, 'grid-template-columns', {
                base: (d.columns as string) || '1fr',
                sm: d.columnsSm as string,
                md: d.columnsMd as string,
                lg: d.columnsLg as string,
                xl: d.columnsXl as string,
            }),
        );
        parts.push(
            generateResponsiveContainerCSS(selector, 'gap', {
                base: (d.gap as string) || '1rem',
                sm: d.gapSm as string,
                md: d.gapMd as string,
                lg: d.gapLg as string,
                xl: d.gapXl as string,
            }),
        );
    } else if (props.entry.type === 'section' || props.entry.type === 'flex') {
        const dir = (v: string | undefined) => (v === 'row' ? 'row' : 'column');
        parts.push(
            generateResponsiveContainerCSS(selector, 'flex-direction', {
                base: dir((d.direction as string) || 'column'),
                sm: d.directionSm ? dir(d.directionSm as string) : undefined,
                md: d.directionMd ? dir(d.directionMd as string) : undefined,
                lg: d.directionLg ? dir(d.directionLg as string) : undefined,
                xl: d.directionXl ? dir(d.directionXl as string) : undefined,
            }),
        );
        parts.push(
            generateResponsiveContainerCSS(selector, 'gap', {
                base: (d.gap as string) || '1rem',
                sm: d.gapSm as string,
                md: d.gapMd as string,
                lg: d.gapLg as string,
                xl: d.gapXl as string,
            }),
        );
        const mapJ = (v: string | undefined) =>
            ({ start: 'flex-start', center: 'center', end: 'flex-end', 'space-between': 'space-between', 'space-around': 'space-around' }[v ?? 'start'] ?? 'flex-start');
        const mapA = (v: string | undefined) =>
            ({ start: 'flex-start', center: 'center', end: 'flex-end', stretch: 'stretch' }[v ?? 'stretch'] ?? 'stretch');
        parts.push(
            generateResponsiveContainerCSS(selector, 'justify-content', {
                base: mapJ(d.justify as string),
                sm: d.justifySm ? mapJ(d.justifySm as string) : undefined,
                md: d.justifyMd ? mapJ(d.justifyMd as string) : undefined,
                lg: d.justifyLg ? mapJ(d.justifyLg as string) : undefined,
                xl: d.justifyXl ? mapJ(d.justifyXl as string) : undefined,
            }),
        );
        parts.push(
            generateResponsiveContainerCSS(selector, 'align-items', {
                base: mapA(d.align as string),
                sm: d.alignSm ? mapA(d.alignSm as string) : undefined,
                md: d.alignMd ? mapA(d.alignMd as string) : undefined,
                lg: d.alignLg ? mapA(d.alignLg as string) : undefined,
                xl: d.alignXl ? mapA(d.alignXl as string) : undefined,
            }),
        );
    }
    return parts.filter(Boolean).join('\n');
});

function injectLayoutContainerStyles(): void {
    if (!layoutContainerCSS.value) {
        if (layoutContainerStyleEl.value) {
            layoutContainerStyleEl.value.remove();
            layoutContainerStyleEl.value = null;
        }
        return;
    }
    if (!layoutContainerStyleEl.value) {
        layoutContainerStyleEl.value = document.createElement('style');
        layoutContainerStyleEl.value.setAttribute('data-layout-container', props.entry.id);
        document.head.appendChild(layoutContainerStyleEl.value);
    }
    layoutContainerStyleEl.value.textContent = layoutContainerCSS.value;
}

onMounted(() => injectLayoutContainerStyles());
onUnmounted(() => {
    if (layoutContainerStyleEl.value) {
        layoutContainerStyleEl.value.remove();
        layoutContainerStyleEl.value = null;
    }
});
watch(layoutContainerCSS, () => injectLayoutContainerStyles());

const containerDropTargetIndex = ref<number | null>(null);

function onContainerDropZoneDragOver(index: number, e: DragEvent): void {
    e.preventDefault();
    e.dataTransfer ??= new DataTransfer();
    e.dataTransfer.dropEffect = 'copy';
    containerDropTargetIndex.value = index;
}

function onContainerDropZoneDragLeave(): void {
    containerDropTargetIndex.value = null;
}

function onContainerDropZoneDrop(index: number, e: DragEvent): void {
    e.preventDefault();
    containerDropTargetIndex.value = null;
    const type = e.dataTransfer?.getData('component-type');
    if (type && props.insertAtParent) {
        props.insertAtParent(props.entry.id, index, type);
    }
}

const motionPreset = computed(() =>
    getMotionPreset((props.entry.data as Record<string, unknown>)?.motion as string),
);

const DESIGN_BLOCK_TYPES = ['hero', 'cta', 'about', 'hours'] as const;
const useDesignBlock = computed(
    () =>
        props.designMode &&
        DESIGN_BLOCK_TYPES.includes(props.entry.type as (typeof DESIGN_BLOCK_TYPES)[number]),
);
</script>

<template>
    <div
        v-if="designMode"
        :data-module-id="entry.id"
        class="relative flex min-h-[2.5rem] cursor-pointer outline-none ring-1 ring-transparent transition-[outline-color,box-shadow] hover:ring-primary/50 focus-within:ring-primary"
        :class="{ 'ring-1 ring-primary': selectedModuleId === entry.id }"
        tabindex="0"
        role="button"
        aria-label="Bereich auswählen und Einstellungen öffnen"
        @click.stop="onSelect(entry.id)"
        @keydown.enter.space.prevent="onSelect(entry.id)"
    >
        <div
            v-if="!embeddingProvidesDragHandle"
            class="block-drag-handle absolute left-0 top-0 z-10 flex h-full min-w-5 cursor-grab items-center justify-center bg-muted/50 text-muted-foreground active:cursor-grabbing"
            aria-hidden
            @click.stop
        >
            <GripVertical class="h-3.5 w-3.5" />
        </div>
        <DropdownMenu v-if="blockContextActions?.value" v-slot>
            <DropdownMenuTrigger as-child>
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    class="absolute right-0 top-0 z-10 h-7 w-7 shrink-0 rounded-sm opacity-70 hover:opacity-100"
                    aria-label="Block-Menü"
                    @click.stop
                >
                    <MoreHorizontal class="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" class="min-w-[10rem]">
                <DropdownMenuItem
                    @select="blockContextActions.value.duplicate(entry.id)"
                >
                    <Copy class="mr-2 h-4 w-4" />
                    Duplizieren
                </DropdownMenuItem>
                <DropdownMenuItem
                    @select="blockContextActions.value.copy(entry.id)"
                >
                    <Copy class="mr-2 h-4 w-4" />
                    Kopieren
                </DropdownMenuItem>
                <DropdownMenuItem
                    :disabled="!blockContextActions.value.getCanPaste()"
                    @select="blockContextActions.value.paste(entry.id)"
                >
                    <ClipboardPaste class="mr-2 h-4 w-4" />
                    Einfügen
                </DropdownMenuItem>
                <DropdownMenuItem
                    variant="destructive"
                    @select="blockContextActions.value.remove(entry.id)"
                >
                    <Trash2 class="mr-2 h-4 w-4" />
                    Löschen
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
        <div class="min-w-0 flex-1" :class="embeddingProvidesDragHandle ? 'pl-0' : 'pl-5'">
        <!-- Container in design mode: draggable slot and drop zones for section, grid, flex -->
        <template v-if="designMode && acceptsChildren(entry.type as LayoutComponentType)">
            <template v-if="motionPreset">
                <motion.div
                    class="min-w-0 flex-1"
                    :initial="motionPreset.initial"
                    :animate="motionPreset.animate"
                    :transition="motionPreset.transition"
                >
                    <component
                        :is="getLayoutComponent(entry.type)"
                        v-if="getLayoutComponent(entry.type)"
                        :data="entry.data ?? {}"
                        :design-mode="designMode"
                        class="min-w-0 flex-1 flex flex-col"
                    >
                        <div
                            v-if="insertAtParent"
                            class="min-h-2.5 shrink-0 border border-dashed border-transparent transition-colors"
                            :class="{ 'border-primary bg-primary/10': containerDropTargetIndex === 0 }"
                            @dragover="onContainerDropZoneDragOver(0, $event)"
                            @dragleave="onContainerDropZoneDragLeave"
                            @drop="onContainerDropZoneDrop(0, $event)"
                        >
                            <span class="sr-only">Komponente hier einfügen</span>
                        </div>
                        <draggable
                            v-model="containerChildrenFiltered"
                            item-key="id"
                            handle=".block-drag-handle"
                            :group="{ name: 'layout-blocks', pull: true, put: true }"
                            :class="[
                                'section-children-flex min-h-[2.5rem] min-w-0 flex-1',
                                containerUsesResponsiveQueries && 'layout-block-container-responsive',
                            ]"
                            :data-layout-container-id="containerUsesResponsiveQueries ? entry.id : undefined"
                            :style="getContainerStyle()"
                            ghost-class="opacity-50"
                            :revert-on-spill="true"
                            @start="emit('dragStart')"
                            @end="onContainerDragEnd"
                        >
                            <template #item="{ element: child, index }">
                                <div
                                    class="flex min-w-0 flex-col"
                                    :class="{ 'w-full': isGridOrFlexContainer() }"
                                    :style="getChildFlexStyle(child)"
                                >
                                    <div
                                        v-if="insertAtParent"
                                        class="min-h-2.5 shrink-0 border border-dashed border-transparent transition-colors"
                                        :class="{ 'border-primary bg-primary/10': containerDropTargetIndex === index + 1 }"
                                        @dragover="onContainerDropZoneDragOver(index + 1, $event)"
                                        @dragleave="onContainerDropZoneDragLeave"
                                        @drop="onContainerDropZoneDrop(index + 1, $event)"
                                    >
                                        <span class="sr-only">Komponente hier einfügen</span>
                                    </div>
                                    <div
                                        class="section-child relative flex min-h-[2rem] min-w-0 flex-1 flex-row"
                                        :class="{ 'w-full': isGridOrFlexContainer() }"
                                    >
                                        <div
                                            class="block-drag-handle absolute left-0 top-0 z-10 flex h-full min-w-5 cursor-grab items-center justify-center bg-muted/50 text-muted-foreground active:cursor-grabbing"
                                            aria-hidden
                                            @click.stop
                                        >
                                            <GripVertical class="h-3.5 w-3.5" />
                                        </div>
                                        <div class="min-w-0 pl-5">
                                            <LayoutBlock
                                                :entry="child"
                                                :design-mode="designMode"
                                                :selected-module-id="selectedModuleId"
                                                :insert-at-parent="insertAtParent"
                                                embedding-provides-drag-handle
                                                @select="onSelect"
                                                @reorder="emit('reorder')"
                                                @drag-start="emit('dragStart')"
                                            />
                                        </div>
                                        <ResizeHandle
                                            v-if="entry.type === 'section' && isRow() && getNextChild(index)"
                                            :left-entry="child"
                                            :right-entry="getNextChild(index)!"
                                            class="shrink-0"
                                            @resize="emit('reorder')"
                                        />
                                    </div>
                                </div>
                            </template>
                        </draggable>
                        <div
                            v-if="insertAtParent"
                            class="min-h-2.5 shrink-0 border border-dashed border-transparent transition-colors"
                            :class="{ 'border-primary bg-primary/10': containerDropTargetIndex === containerChildrenFiltered.length }"
                            @dragover="onContainerDropZoneDragOver(containerChildrenFiltered.length, $event)"
                            @dragleave="onContainerDropZoneDragLeave"
                            @drop="onContainerDropZoneDrop(containerChildrenFiltered.length, $event)"
                        >
                            <span class="sr-only">Komponente am Ende einfügen</span>
                        </div>
                    </component>
                </motion.div>
            </template>
            <component
                v-else
                :is="getLayoutComponent(entry.type)"
                v-if="getLayoutComponent(entry.type)"
                :data="entry.data ?? {}"
                :design-mode="designMode"
                class="min-w-0 flex-1 flex flex-col"
            >
                <div
                    v-if="insertAtParent"
                    class="min-h-2.5 shrink-0 border border-dashed border-transparent transition-colors"
                    :class="{ 'border-primary bg-primary/10': containerDropTargetIndex === 0 }"
                    @dragover="onContainerDropZoneDragOver(0, $event)"
                    @dragleave="onContainerDropZoneDragLeave"
                    @drop="onContainerDropZoneDrop(0, $event)"
                >
                    <span class="sr-only">Komponente hier einfügen</span>
                </div>
                <draggable
                    v-model="containerChildrenFiltered"
                    item-key="id"
                    handle=".block-drag-handle"
                    :group="{ name: 'layout-blocks', pull: true, put: true }"
                    :class="[
                        'section-children-flex min-h-[2.5rem] min-w-0 flex-1',
                        containerUsesResponsiveQueries && 'layout-block-container-responsive',
                    ]"
                    :data-layout-container-id="containerUsesResponsiveQueries ? entry.id : undefined"
                    :style="getContainerStyle()"
                    ghost-class="opacity-50"
                    :revert-on-spill="true"
                    @start="emit('dragStart')"
                    @end="onContainerDragEnd"
                >
                    <template #item="{ element: child, index }">
                        <div
                            class="flex min-w-0 flex-col"
                            :class="{ 'w-full': isGridOrFlexContainer() }"
                            :style="getChildFlexStyle(child)"
                        >
                            <div
                                v-if="insertAtParent"
                                class="min-h-2.5 shrink-0 border border-dashed border-transparent transition-colors"
                                :class="{ 'border-primary bg-primary/10': containerDropTargetIndex === index + 1 }"
                                @dragover="onContainerDropZoneDragOver(index + 1, $event)"
                                @dragleave="onContainerDropZoneDragLeave"
                                @drop="onContainerDropZoneDrop(index + 1, $event)"
                            >
                                <span class="sr-only">Komponente hier einfügen</span>
                            </div>
                            <div
                                class="section-child relative flex min-h-[2rem] min-w-0 flex-1 flex-row"
                                :class="{ 'w-full': isGridOrFlexContainer() }"
                            >
                                <div
                                    class="block-drag-handle absolute left-0 top-0 z-10 flex h-full min-w-5 cursor-grab items-center justify-center bg-muted/50 text-muted-foreground active:cursor-grabbing"
                                    aria-hidden
                                    @click.stop
                                >
                                    <GripVertical class="h-3.5 w-3.5" />
                                </div>
                                <div class="min-w-0 pl-5">
                                    <LayoutBlock
                                        :entry="child"
                                        :design-mode="designMode"
                                        :selected-module-id="selectedModuleId"
                                        :insert-at-parent="insertAtParent"
                                        embedding-provides-drag-handle
                                        @select="onSelect"
                                        @reorder="emit('reorder')"
                                        @drag-start="emit('dragStart')"
                                    />
                                </div>
                                <ResizeHandle
                                    v-if="entry.type === 'section' && isRow() && getNextChild(index)"
                                    :left-entry="child"
                                    :right-entry="getNextChild(index)!"
                                    class="shrink-0"
                                    @resize="emit('reorder')"
                                />
                            </div>
                        </div>
                    </template>
                </draggable>
                <div
                    v-if="insertAtParent"
                    class="min-h-2.5 shrink-0 border border-dashed border-transparent transition-colors"
                    :class="{ 'border-primary bg-primary/10': containerDropTargetIndex === containerChildrenFiltered.length }"
                    @dragover="onContainerDropZoneDragOver(containerChildrenFiltered.length, $event)"
                    @dragleave="onContainerDropZoneDragLeave"
                    @drop="onContainerDropZoneDrop(containerChildrenFiltered.length, $event)"
                >
                    <span class="sr-only">Komponente am Ende einfügen</span>
                </div>
            </component>
        </template>
        <template v-else>
            <template v-if="motionPreset">
                <motion.div
                    class="min-w-0 flex-1"
                    :initial="motionPreset.initial"
                    :animate="motionPreset.animate"
                    :transition="motionPreset.transition"
                >
                    <DesignBlock
                        v-if="useDesignBlock"
                        :entry="entry"
                        :design-mode="designMode"
                        class="min-w-0 flex-1"
                    />
                    <component
                        v-else
                        :is="getLayoutComponent(entry.type)"
                        v-if="getLayoutComponent(entry.type)"
                        :data="entry.data ?? {}"
                        :design-mode="designMode"
                        class="min-w-0 flex-1"
                    >
                        <template v-if="childEntries().length > 0">
                            <div
                                v-for="child in childEntries()"
                                :key="child.id"
                                class="section-child min-w-0"
                                :style="getChildFlexStyle(child)"
                            >
                                <LayoutBlock
                                    :entry="child"
                                    :design-mode="designMode"
                                    :selected-module-id="selectedModuleId"
                                    :insert-at-parent="insertAtParent"
                                    @select="onSelect"
                                    @reorder="emit('reorder')"
                                    @drag-start="emit('dragStart')"
                                />
                            </div>
                        </template>
                    </component>
                </motion.div>
            </template>
            <template v-else>
                <DesignBlock
                    v-if="useDesignBlock"
                    :entry="entry"
                    :design-mode="designMode"
                    class="min-w-0 flex-1"
                />
                <component
                    v-else
                    :is="getLayoutComponent(entry.type)"
                    v-if="getLayoutComponent(entry.type)"
                    :data="entry.data ?? {}"
                    :design-mode="designMode"
                    class="min-w-0 flex-1"
                >
                    <template v-if="childEntries().length > 0">
                        <div
                            v-for="child in childEntries()"
                            :key="child.id"
                            class="section-child min-w-0"
                            :style="getChildFlexStyle(child)"
                        >
                            <LayoutBlock
                                :entry="child"
                                :design-mode="designMode"
                                :selected-module-id="selectedModuleId"
                                :insert-at-parent="insertAtParent"
                                @select="onSelect"
                                @reorder="emit('reorder')"
                                @drag-start="emit('dragStart')"
                            />
                        </div>
                    </template>
                </component>
            </template>
        </template>
        </div>
    </div>
    <template v-else>
        <template v-if="motionPreset">
            <motion.div
                class="min-w-0"
                :initial="motionPreset.initial"
                :animate="motionPreset.animate"
                :transition="motionPreset.transition"
            >
                <component
                    :is="getLayoutComponent(entry.type)"
                    v-if="getLayoutComponent(entry.type)"
                    :data="entry.data ?? {}"
                    :design-mode="designMode"
                >
                    <template v-if="childEntries().length > 0">
                        <div
                            v-for="child in childEntries()"
                            :key="child.id"
                            class="section-child min-w-0"
                            :style="getChildFlexStyle(child)"
                        >
                            <LayoutBlock :entry="child" />
                        </div>
                    </template>
                </component>
            </motion.div>
        </template>
        <component
            v-else
            :is="getLayoutComponent(entry.type)"
            v-if="getLayoutComponent(entry.type)"
            :data="entry.data ?? {}"
            :design-mode="designMode"
        >
            <template v-if="childEntries().length > 0">
                <div
                    v-for="child in childEntries()"
                    :key="child.id"
                    class="section-child min-w-0"
                    :style="getChildFlexStyle(child)"
                >
                    <LayoutBlock :entry="child" />
                </div>
            </template>
        </component>
    </template>
</template>
