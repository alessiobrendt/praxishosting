<script setup lang="ts">
import { getLayoutComponent } from '@/templates/praxisemerald/component-map';
import { acceptsChildren } from '@/templates/praxisemerald/component-registry';
import type {
    LayoutComponentEntry,
    SectionJustify,
    SectionAlign,
} from '@/types/layout-components';
import type { LayoutComponentType } from '@/types/layout-components';
import draggable from 'vuedraggable';
import { GripVertical } from 'lucide-vue-next';
import ResizeHandle from '@/templates/praxisemerald/components/ResizeHandle.vue';

const props = withDefaults(
    defineProps<{
        entry: LayoutComponentEntry;
        designMode?: boolean;
        selectedModuleId?: string | null;
    }>(),
    { designMode: false, selectedModuleId: null },
);

const emit = defineEmits<{
    (e: 'select', id: string): void;
    (e: 'reorder'): void;
}>();

function childEntries(): LayoutComponentEntry[] {
    if (!acceptsChildren(props.entry.type as LayoutComponentType)) return [];
    const c = props.entry.children;
    if (!Array.isArray(c)) return [];
    return c.filter(
        (e): e is LayoutComponentEntry =>
            e && typeof e === 'object' && typeof (e as LayoutComponentEntry).id === 'string' && typeof (e as LayoutComponentEntry).type === 'string',
    );
}

/** Section children array for draggable; ensures entry.children is always an array. */
function getSectionChildren(): LayoutComponentEntry[] {
    if (props.entry.type !== 'section') return [];
    let c = props.entry.children;
    if (!Array.isArray(c)) {
        c = [];
        (props.entry as Record<string, unknown>).children = c;
    }
    return c as LayoutComponentEntry[];
}

const isRow = (): boolean => (props.entry.data?.direction as string) === 'row';

function getChildFlexStyle(child: LayoutComponentEntry): Record<string, string> {
    if (!isRow()) return {};
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
    const list = getSectionChildren();
    return list[index + 1];
}

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
</script>

<template>
    <div
        v-if="designMode"
        :data-module-id="entry.id"
        class="relative flex cursor-pointer outline-none ring-2 ring-transparent transition-[outline-color,box-shadow] hover:ring-primary focus-within:ring-primary"
        :class="{ 'ring-2 ring-primary': selectedModuleId === entry.id }"
        tabindex="0"
        role="button"
        @click.stop="onSelect(entry.id)"
        @keydown.enter.space.prevent="onSelect(entry.id)"
    >
        <div
            class="block-drag-handle absolute left-0 top-0 z-10 flex h-full min-w-6 cursor-grab items-center justify-center bg-muted/50 text-muted-foreground active:cursor-grabbing"
            aria-hidden
            @click.stop
        >
            <GripVertical class="h-4 w-4" />
        </div>
        <div class="min-w-0 flex-1 pl-6">
        <!-- Section in design mode: always render SectionBlock with draggable slot (so slot is never empty) -->
        <template v-if="designMode && entry.type === 'section'">
            <component
                :is="getLayoutComponent(entry.type)"
                v-if="getLayoutComponent(entry.type)"
                :data="entry.data ?? {}"
                class="min-w-0 flex-1"
            >
                <draggable
                    :list="getSectionChildren()"
                    item-key="id"
                    handle=".block-drag-handle"
                    :group="'layout-blocks'"
                    class="section-children-flex min-h-[4rem] min-w-0 flex-1"
                    :style="getSectionFlexStyle()"
                    ghost-class="opacity-50"
                    @end="emit('reorder')"
                >
                    <template #item="{ element: child, index }">
                        <div
                            class="section-child relative flex min-h-[3rem] min-w-0 flex-row"
                            :style="getChildFlexStyle(child)"
                        >
                            <div
                                class="block-drag-handle absolute left-0 top-0 z-10 flex h-full min-w-6 cursor-grab items-center justify-center bg-muted/50 text-muted-foreground active:cursor-grabbing"
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
                                    @select="onSelect"
                                    @reorder="emit('reorder')"
                                />
                            </div>
                            <ResizeHandle
                                v-if="isRow() && getNextChild(index)"
                                :left-entry="child"
                                :right-entry="getNextChild(index)!"
                                class="shrink-0"
                                @resize="emit('reorder')"
                            />
                        </div>
                    </template>
                </draggable>
            </component>
        </template>
        <template v-else>
            <component
                :is="getLayoutComponent(entry.type)"
                v-if="getLayoutComponent(entry.type)"
                :data="entry.data ?? {}"
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
                            @select="onSelect"
                            @reorder="emit('reorder')"
                        />
                    </div>
                </template>
            </component>
        </template>
        </div>
    </div>
    <component
        v-else
        :is="getLayoutComponent(entry.type)"
        v-if="getLayoutComponent(entry.type)"
        :data="entry.data ?? {}"
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
