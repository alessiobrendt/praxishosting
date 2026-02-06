<script setup lang="ts">
import { ref, watch, computed, provide, nextTick } from 'vue';
import { getLayoutComponent } from '@/templates/handyso/component-map';
import { acceptsChildren } from '@/templates/handyso/combined-registry';
import { isSlotContainer } from '@/templates/handyso/component-registry';
import { getMotionPreset } from '@/templates/handyso/motion-presets';
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
    }>(),
    { designMode: false, selectedModuleId: null, insertAtParent: undefined },
);

const emit = defineEmits<{
    (e: 'select', id: string): void;
    (e: 'reorder'): void;
    (e: 'dragStart'): void;
}>();

provide('layoutEntry', computed(() => props.entry));

function childEntries(): LayoutComponentEntry[] {
    const entry = props.entry;
    if (!entry || !acceptsChildren(entry.type as LayoutComponentType)) return [];
    const c = entry.children;
    if (!Array.isArray(c)) return [];
    return c.filter(
        (e): e is LayoutComponentEntry =>
            e && typeof e === 'object' && typeof (e as LayoutComponentEntry).id === 'string' && typeof (e as LayoutComponentEntry).type === 'string',
    );
}

/** Container children array; ensures entry.children is always an array for any container type. */
function getContainerChildren(): LayoutComponentEntry[] {
    const entry = props.entry;
    if (!entry || !acceptsChildren(entry.type as LayoutComponentType)) return [];
    let c = entry.children;
    if (!Array.isArray(c)) {
        c = [];
        (entry as Record<string, unknown>).children = c;
    }
    return c as LayoutComponentEntry[];
}

/** Only valid container children (for display/reorder); invalid entries are not rendered. */
const containerChildrenFiltered = ref<LayoutComponentEntry[]>([]);

watch(
    () => getContainerChildren(),
    (raw) => {
        containerChildrenFiltered.value = raw.filter(isValidContainerChild);
    },
    { immediate: true, deep: true },
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

function getSectionFlexStyle(): Record<string, string> {
    const d = props.entry.data ?? {};
    return {
        display: 'flex',
        flexDirection: (d.direction as string) === 'row' ? 'row' : 'column',
        flexWrap: (d.wrap as boolean) !== false ? 'wrap' : 'nowrap',
        gap: (d.gap as string) ?? '1rem',
        justifyContent: mapJustify(d.justify as SectionJustify),
        alignItems: mapAlign(d.align as SectionAlign),
    };
}

function getGridStyle(): Record<string, string> {
    const d = props.entry.data ?? {};
    const style: Record<string, string> = {
        display: 'grid',
        gap: (d.gap as string) ?? '1rem',
    };
    if (d.columns) {
        style.gridTemplateColumns = d.columns as string;
    }
    if (d.rowGap) {
        style.rowGap = d.rowGap as string;
    }
    if (d.columnGap) {
        style.columnGap = d.columnGap as string;
    }
    return style;
}

function getContainerStyle(): Record<string, string> {
    if (props.entry.type === 'grid') {
        return getGridStyle();
    }
    return getSectionFlexStyle();
}

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
</script>

<template>
    <div
        v-if="designMode"
        :data-module-id="entry.id"
        class="relative flex cursor-pointer outline-none ring-2 ring-transparent transition-[outline-color,box-shadow] hover:ring-[#fd7f2b] focus-within:ring-[#fd7f2b]"
        :class="{ 'ring-2 ring-[#fd7f2b]': selectedModuleId === entry.id }"
        tabindex="0"
        role="button"
        @click.stop="onSelect(entry.id)"
        @keydown.enter.space.prevent="onSelect(entry.id)"
    >
        <div
            class="block-drag-handle absolute left-0 top-0 z-10 flex h-full min-w-6 cursor-grab items-center justify-center bg-gray-200/80 text-gray-600 active:cursor-grabbing"
            aria-hidden
            @click.stop
        >
            <GripVertical class="h-4 w-4" />
        </div>
        <div class="min-w-0 flex-1 pl-6">
        <!-- Slot container: render only the section with entry (reorder in sidebar) -->
        <template v-if="designMode && isSlotContainer(entry.type)">
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
                        :entry="entry"
                        :design-mode="designMode"
                        class="min-w-0 flex-1"
                    />
                </motion.div>
            </template>
            <component
                v-else
                :is="getLayoutComponent(entry.type)"
                v-if="getLayoutComponent(entry.type)"
                :entry="entry"
                :design-mode="designMode"
                class="min-w-0 flex-1"
            />
        </template>
        <!-- Container in design mode (section/grid/flex with draggable children) -->
        <template v-else-if="designMode && acceptsChildren(entry.type as LayoutComponentType)">
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
                            class="min-h-4 shrink-0 border-2 border-dashed border-transparent transition-colors"
                            :class="{ 'border-[#fd7f2b] bg-[#fd7f2b]/10': containerDropTargetIndex === 0 }"
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
                            class="section-children-flex min-h-[4rem] min-w-0 flex-1"
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
                                        class="min-h-4 shrink-0 border-2 border-dashed border-transparent transition-colors"
                                        :class="{ 'border-[#fd7f2b] bg-[#fd7f2b]/10': containerDropTargetIndex === index + 1 }"
                                        @dragover="onContainerDropZoneDragOver(index + 1, $event)"
                                        @dragleave="onContainerDropZoneDragLeave"
                                        @drop="onContainerDropZoneDrop(index + 1, $event)"
                                    >
                                        <span class="sr-only">Komponente hier einfügen</span>
                                    </div>
                                    <div
                                        class="section-child relative flex min-h-[3rem] min-w-0 flex-1 flex-row"
                                        :class="{ 'w-full': isGridOrFlexContainer() }"
                                    >
                                        <div
                                            class="block-drag-handle absolute left-0 top-0 z-10 flex h-full min-w-6 cursor-grab items-center justify-center bg-gray-200/80 text-gray-600 active:cursor-grabbing"
                                            aria-hidden
                                            @click.stop
                                        >
                                            <GripVertical class="h-4 w-4" />
                                        </div>
                                        <div class="min-w-0 pl-6">
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
                            class="min-h-4 shrink-0 border-2 border-dashed border-transparent transition-colors"
                            :class="{ 'border-[#fd7f2b] bg-[#fd7f2b]/10': containerDropTargetIndex === containerChildrenFiltered.length }"
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
                    class="min-h-4 shrink-0 border-2 border-dashed border-transparent transition-colors"
                    :class="{ 'border-[#fd7f2b] bg-[#fd7f2b]/10': containerDropTargetIndex === 0 }"
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
                    class="section-children-flex min-h-[4rem] min-w-0 flex-1"
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
                                class="min-h-4 shrink-0 border-2 border-dashed border-transparent transition-colors"
                                :class="{ 'border-[#fd7f2b] bg-[#fd7f2b]/10': containerDropTargetIndex === index + 1 }"
                                @dragover="onContainerDropZoneDragOver(index + 1, $event)"
                                @dragleave="onContainerDropZoneDragLeave"
                                @drop="onContainerDropZoneDrop(index + 1, $event)"
                            >
                                <span class="sr-only">Komponente hier einfügen</span>
                            </div>
                            <div
                                class="section-child relative flex min-h-[3rem] min-w-0 flex-1 flex-row"
                                :class="{ 'w-full': isGridOrFlexContainer() }"
                            >
                                <div
                                    class="block-drag-handle absolute left-0 top-0 z-10 flex h-full min-w-6 cursor-grab items-center justify-center bg-gray-200/80 text-gray-600 active:cursor-grabbing"
                                    aria-hidden
                                    @click.stop
                                >
                                    <GripVertical class="h-4 w-4" />
                                </div>
                                <div class="min-w-0 pl-6">
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
                    class="min-h-4 shrink-0 border-2 border-dashed border-transparent transition-colors"
                    :class="{ 'border-[#fd7f2b] bg-[#fd7f2b]/10': containerDropTargetIndex === containerChildrenFiltered.length }"
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
                    <component
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
        </div>
    </div>
    <template v-else>
        <!-- Non-design mode: slot containers receive entry and render children at slots -->
        <template v-if="isSlotContainer(entry.type)">
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
                        :entry="entry"
                        :design-mode="designMode"
                    />
                </motion.div>
            </template>
            <component
                v-else
                :is="getLayoutComponent(entry.type)"
                v-if="getLayoutComponent(entry.type)"
                :entry="entry"
                :design-mode="designMode"
            />
        </template>
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
</template>
