<script setup lang="ts">
import { ref, watch } from 'vue';
import type { LayoutComponentEntry } from '@/types/layout-components';
import draggable from 'vuedraggable';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { GripVertical, MoreVertical } from 'lucide-vue-next';

const props = withDefaults(
    defineProps<{
        /** Root-level layout components (depth 0 only). */
        list: LayoutComponentEntry[];
        getComponentLabel: (type: string, entry?: { data?: Record<string, unknown> }) => string;
        selectedModuleId: string | null;
    }>(),
    {},
);

const emit = defineEmits<{
    (e: 'update:list', value: LayoutComponentEntry[]): void;
    (e: 'select', id: string): void;
    (e: 'remove', rootIndex: number): void;
    (e: 'duplicate', rootIndex: number): void;
    (e: 'move', rootIndex: number, direction: 'up' | 'down'): void;
}>();

const localList = ref<LayoutComponentEntry[]>([]);

watch(
    () => props.list,
    (val) => {
        localList.value = Array.isArray(val) ? [...val] : [];
    },
    { immediate: true, deep: true },
);

function onDragEnd(): void {
    emit('update:list', [...localList.value]);
}

function onSelect(id: string): void {
    emit('select', id);
}

function onRemove(rootIndex: number): void {
    emit('remove', rootIndex);
}

function onDuplicate(rootIndex: number): void {
    emit('duplicate', rootIndex);
}

function onMove(rootIndex: number, direction: 'up' | 'down'): void {
    emit('move', rootIndex, direction);
}
</script>

<template>
    <div class="space-y-0.5">
        <draggable
            v-model="localList"
            item-key="id"
            handle=".section-drag-handle"
            ghost-class="section-list-ghost"
            class="flex flex-col gap-0.5"
            :animation="180"
            @end="onDragEnd"
        >
            <template #item="{ element: entry, index: rootIndex }">
                <div
                    :class="[
                        'flex items-center gap-1.5 rounded-md border py-1 pl-1.5 pr-1 transition-colors',
                        selectedModuleId === entry.id
                            ? 'border-primary bg-primary/10 ring-1 ring-primary/30'
                            : 'border-border hover:bg-muted/50',
                    ]"
                >
                    <GripVertical
                        class="section-drag-handle h-4 w-4 shrink-0 cursor-grab text-muted-foreground active:cursor-grabbing"
                        aria-hidden
                    />
                    <span
                        class="flex h-6 w-5 shrink-0 items-center justify-center text-xs font-medium text-muted-foreground"
                        aria-hidden
                    >
                        {{ rootIndex + 1 }}
                    </span>
                    <button
                        type="button"
                        class="min-w-0 flex-1 truncate py-0.5 pl-0.5 text-left text-sm font-medium hover:underline"
                        @click="onSelect(entry.id)"
                    >
                        {{ getComponentLabel(entry.type, entry) }}
                    </button>
                    <DropdownMenu>
                        <DropdownMenuTrigger as-child>
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                class="h-7 w-7 shrink-0"
                                aria-label="Optionen"
                                @click.stop
                            >
                                <MoreVertical class="h-3.5 w-3.5" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" class="min-w-[10rem]">
                            <DropdownMenuItem
                                :disabled="rootIndex === 0"
                                @select="onMove(rootIndex, 'up')"
                            >
                                Nach oben
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                :disabled="rootIndex === localList.length - 1"
                                @select="onMove(rootIndex, 'down')"
                            >
                                Nach unten
                            </DropdownMenuItem>
                            <DropdownMenuItem @select="onDuplicate(rootIndex)">
                                Duplizieren
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                variant="destructive"
                                @select="onRemove(rootIndex)"
                            >
                                Entfernen
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </template>
        </draggable>
    </div>
</template>

<style scoped>
.section-list-ghost {
    opacity: 0.6;
    background-color: var(--muted);
}
</style>
