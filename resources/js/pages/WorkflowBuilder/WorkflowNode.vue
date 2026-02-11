<script setup lang="ts">
import { computed } from 'vue';
import type { WorkflowNode as WorkflowNodeType } from '@/types/workflow';
import type { NodeTypeDef } from '@/types/workflow';

const props = withDefaults(
    defineProps<{
        node: WorkflowNodeType;
        nodeTypeDef?: NodeTypeDef | null;
        selected: boolean;
        outPortActive?: boolean;
    }>(),
    { outPortActive: false },
);

const emit = defineEmits<{
    (e: 'select'): void;
    (e: 'drag-start', e: MouseEvent): void;
    (e: 'port-click', kind: 'in' | 'out'): void;
}>();

const chip = computed(() => props.nodeTypeDef?.chip ?? 'Node');

function onNodeMousedown(e: MouseEvent): void {
    const target = e.target as Node | null;
    const el =
        target?.nodeType === 1
            ? (target as Element)
            : (target?.parentNode as Element | null);
    if (el?.closest('.workflow-port')) return;
    emit('select');
}
</script>

<template>
    <div
        class="workflow-node"
        :class="{ 'workflow-node-selected': selected }"
        :style="{ left: node.x + 'px', top: node.y + 'px' }"
        @mousedown="onNodeMousedown"
    >
        <div
            class="workflow-node-header"
            @mousedown="(e: MouseEvent) => emit('drag-start', e)"
        >
            <div>
                <div class="workflow-node-title">{{ node.label }}</div>
                <div class="workflow-node-type">{{ node.type }}</div>
            </div>
            <span class="workflow-chip">{{ chip }}</span>
        </div>
        <div class="workflow-node-body">
            {{ nodeTypeDef?.desc ?? '' }}
        </div>
        <div class="workflow-node-ports">
            <div class="flex flex-col gap-2">
                <button
                    type="button"
                    class="workflow-port"
                    :data-node="node.id"
                    data-port="in"
                    @mousedown.stop
                    @click.stop="emit('port-click', 'in')"
                >
                    <span class="workflow-dot workflow-dot-in" />
                    <span>in</span>
                </button>
            </div>
            <div class="flex flex-col items-end gap-2">
                <button
                    type="button"
                    class="workflow-port"
                    :data-node="node.id"
                    data-port="out"
                    @mousedown.stop
                    @click.stop="emit('port-click', 'out')"
                >
                    <span>out</span>
                    <span
                        class="workflow-dot workflow-dot-out"
                        :class="{ 'workflow-dot-active': outPortActive }"
                    />
                </button>
            </div>
        </div>
    </div>
</template>
