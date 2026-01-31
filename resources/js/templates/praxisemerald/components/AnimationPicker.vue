<script setup lang="ts">
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    getMotionPreset,
    getMotionPresetLabel,
    getMotionPresetList,
} from '@/templates/praxisemerald/motion-presets';
import { motion } from 'motion-v';
import { ref, computed } from 'vue';

const props = defineProps<{
    modelValue: string;
}>();

const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void;
}>();

const open = ref(false);
const hoveredPresetId = ref<string | null>(null);
const replayKey = ref(0);

function onOpenChange(value: boolean) {
    open.value = value;
    if (!value) hoveredPresetId.value = null;
}

function onPresetMouseEnter(id: string) {
    hoveredPresetId.value = id;
    if (id) replayKey.value += 1;
}

function onPresetMouseLeave() {
    hoveredPresetId.value = null;
}

const presetList = computed(() => [
    { id: '', label: 'Keine' },
    ...getMotionPresetList(),
]);

const currentLabel = computed(() => getMotionPresetLabel(props.modelValue));

function select(id: string) {
    emit('update:modelValue', id);
    open.value = false;
}
</script>

<template>
    <DropdownMenu :open="open" @update:open="onOpenChange">
        <DropdownMenuTrigger as-child>
            <button
                type="button"
                class="inline-flex h-10 w-full items-center justify-start gap-2 rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-900 shadow-modern outline-none transition-modern hover:border-emerald-500 hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700"
            >
                <span class="min-w-0 truncate">
                    {{ currentLabel }}
                </span>
            </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent class="w-[280px]" align="start">
            <div class="max-h-[320px] space-y-0.5 overflow-y-auto p-2">
                <button
                    v-for="item in presetList"
                    :key="item.id || 'none'"
                    type="button"
                    class="flex w-full items-center gap-3 rounded-md px-2 py-2 text-left text-sm outline-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    :class="{ 'bg-accent text-accent-foreground': modelValue === item.id }"
                    @click="select(item.id)"
                    @mouseenter="onPresetMouseEnter(item.id)"
                    @mouseleave="onPresetMouseLeave"
                >
                    <div
                        v-if="item.id"
                        class="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-md bg-emerald-500/20"
                    >
                        <motion.div
                            :key="item.id && hoveredPresetId === item.id ? `preview-${item.id}-${replayKey}` : `preview-${item.id}`"
                            class="h-5 w-5 rounded bg-emerald-600"
                            :initial="getMotionPreset(item.id)?.initial ?? {}"
                            :animate="getMotionPreset(item.id)?.animate ?? {}"
                            :transition="getMotionPreset(item.id)?.transition ?? { duration: 0.3 }"
                        />
                    </div>
                    <div
                        v-else
                        class="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-muted"
                    >
                        <span class="text-muted-foreground text-xs">—</span>
                    </div>
                    <span class="min-w-0 truncate">{{ item.label }}</span>
                </button>
            </div>
        </DropdownMenuContent>
    </DropdownMenu>
</template>
