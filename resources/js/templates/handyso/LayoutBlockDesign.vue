<script setup lang="ts">
import { ref, watch } from 'vue';
import { getLayoutComponent } from '@/templates/handyso/component-map';
import { acceptsChildren } from '@/templates/handyso/combined-registry';
import { getMotionPreset } from '@/templates/handyso/motion-presets';
import type { LayoutComponentEntry } from '@/types/layout-components';
import type { LayoutComponentType } from '@/types/layout-components';
import { motion } from 'motion-v';
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
        :group="{ name: 'layout-blocks', pull: true, put: true }"
        class="flex min-h-0 flex-col"
        ghost-class="opacity-50"
        :revert-on-spill="true"
        @end="onListUpdate"
    >
        <template #item="{ element: entry }">
            <div class="flex min-h-0 flex-col">
                <div
                    :data-module-id="entry.id"
                    class="relative flex cursor-pointer outline-none ring-2 ring-transparent transition-[outline-color,box-shadow] hover:ring-[#fd7f2b] focus-within:ring-[#fd7f2b]"
                    :class="{ 'ring-2 ring-[#fd7f2b]': selectedModuleId === entry.id }"
                    tabindex="0"
                    role="button"
                    @click="onSelect(entry.id)"
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
                        <template v-if="getMotionPreset((entry.data as Record<string, unknown>)?.motion as string)">
                            <motion.div
                                class="min-w-0"
                                :initial="getMotionPreset((entry.data as Record<string, unknown>)?.motion as string)?.initial"
                                :animate="getMotionPreset((entry.data as Record<string, unknown>)?.motion as string)?.animate"
                                :transition="getMotionPreset((entry.data as Record<string, unknown>)?.motion as string)?.transition"
                            >
                                <component
                                    :is="getLayoutComponent(entry.type)"
                                    v-if="getLayoutComponent(entry.type)"
                                    :data="entry.data ?? {}"
                                    :design-mode="true"
                                />
                            </motion.div>
                        </template>
                        <component
                            v-else
                            :is="getLayoutComponent(entry.type)"
                            v-if="getLayoutComponent(entry.type)"
                            :data="entry.data ?? {}"
                            :design-mode="true"
                        />
                    </div>
                </div>
                <LayoutBlockDesign
                    v-if="isContainer(entry)"
                    :list="getChildrenList(entry)"
                    :selected-module-id="selectedModuleId"
                    class="ml-4 border-l-2 border-gray-200 pl-2"
                    @update:list="(v) => (entry.children = v)"
                    @select="onSelect"
                />
            </div>
        </template>
    </draggable>
</template>
