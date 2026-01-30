<script setup lang="ts">
import { ref, watch } from 'vue';
import { getLayoutComponent } from '@/templates/praxisemerald/component-map';
import { acceptsChildren } from '@/templates/praxisemerald/component-registry';
import type { LayoutComponentEntry } from '@/types/layout-components';
import type { LayoutComponentType } from '@/types/layout-components';
import draggable from 'vuedraggable';
import { GripVertical } from 'lucide-vue-next';

const props = withDefaults(
    defineProps<{
        list: LayoutComponentEntry[];
        selectedModuleId?: string | null;
    }>(),
    { selectedModuleId: null },
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

function getChildrenList(entry: LayoutComponentEntry): LayoutComponentEntry[] {
    if (!acceptsChildren(entry.type as LayoutComponentType)) return [];
    const c = entry.children;
    if (!Array.isArray(c)) {
        entry.children = [];
        return [];
    }
    return c;
}

function isContainer(entry: LayoutComponentEntry): boolean {
    return acceptsChildren(entry.type as LayoutComponentType);
}

function onListUpdate(): void {
    emit('update:list', [...localList.value]);
}

function onSelect(id: string): void {
    emit('select', id);
}
</script>

<template>
    <draggable
        v-model="localList"
        item-key="id"
        handle=".block-drag-handle"
        :group="'layout-blocks'"
        class="flex min-h-0 flex-col"
        ghost-class="opacity-50"
        @end="onListUpdate"
    >
        <template #item="{ element: entry }">
            <div class="flex min-h-0 flex-col">
                <div
                    :data-module-id="entry.id"
                    class="relative flex cursor-pointer outline-none ring-2 ring-transparent transition-[outline-color,box-shadow] hover:ring-primary focus-within:ring-primary"
                    :class="{ 'ring-2 ring-primary': selectedModuleId === entry.id }"
                    tabindex="0"
                    role="button"
                    @click="onSelect(entry.id)"
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
                        <component
                            :is="getLayoutComponent(entry.type)"
                            v-if="getLayoutComponent(entry.type)"
                            :data="entry.data ?? {}"
                        />
                    </div>
                </div>
                <LayoutBlockDesign
                    v-if="isContainer(entry)"
                    :list="getChildrenList(entry)"
                    :selected-module-id="selectedModuleId"
                    class="ml-4 border-l-2 border-muted pl-2"
                    @update:list="(v) => (entry.children = v)"
                    @select="onSelect"
                />
            </div>
        </template>
    </draggable>
</template>
