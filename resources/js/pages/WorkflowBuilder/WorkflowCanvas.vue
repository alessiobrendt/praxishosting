<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import WorkflowNode from './WorkflowNode.vue';
import type { WorkflowNode as WorkflowNodeType, WorkflowEdge } from '@/types/workflow';
import type { NodeTypeDef } from '@/types/workflow';

const NODE_WIDTH = 260;
const PORT_OFFSET_X_IN = 19;
const PORT_OFFSET_X_OUT = 246;
const PORT_OFFSET_Y_IN = 147;
const PORT_OFFSET_Y_OUT = 132;

const props = defineProps<{
    nodes: WorkflowNodeType[];
    edges: WorkflowEdge[];
    selectedNodeId: string | null;
    connectingFromNode: string | null;
    getNodeType: (type: string) => NodeTypeDef | undefined;
}>();

const emit = defineEmits<{
    (e: 'select', id: string): void;
    (e: 'port-click', nodeId: string, kind: 'in' | 'out'): void;
    (e: 'drag', nodeId: string, dx: number, dy: number): void;
}>();

const canvasRef = ref<HTMLElement | null>(null);
const svgRef = ref<SVGSVGElement | null>(null);
const scrollOffset = ref({ x: 0, y: 0 });

let dragState: {
    nodeId: string;
    startX: number;
    startY: number;
    nodeStartX: number;
    nodeStartY: number;
} | null = null;

function portPosFromNode(nodeId: string, kind: 'in' | 'out'): { x: number; y: number } | null {
    const node = props.nodes.find((n) => n.id === nodeId);
    if (!node) return null;
    const x = node.x + (kind === 'in' ? PORT_OFFSET_X_IN : PORT_OFFSET_X_OUT);
    const y = node.y + (kind === 'in' ? PORT_OFFSET_Y_IN : PORT_OFFSET_Y_OUT);
    return {
        x: x - scrollOffset.value.x,
        y: y - scrollOffset.value.y,
    };
}

function updateScrollOffset(): void {
    if (canvasRef.value) {
        scrollOffset.value = {
            x: canvasRef.value.scrollLeft,
            y: canvasRef.value.scrollTop,
        };
    }
}

const edgePaths = computed(() =>
    props.edges.map((edge) => {
        const a = portPosFromNode(edge.from, 'out');
        const b = portPosFromNode(edge.to, 'in');
        if (!a || !b) return '';
        const dx = Math.max(60, Math.abs(b.x - a.x) * 0.5);
        return `M ${a.x} ${a.y} C ${a.x + dx} ${a.y}, ${b.x - dx} ${b.y}, ${b.x} ${b.y}`;
    }),
);

function onNodeDragStart(nodeId: string, e: MouseEvent): void {
    const node = props.nodes.find((n) => n.id === nodeId);
    if (!node) return;
    dragState = {
        nodeId,
        startX: e.clientX,
        startY: e.clientY,
        nodeStartX: node.x,
        nodeStartY: node.y,
    };
}

function onMouseMove(e: MouseEvent): void {
    if (!dragState) return;
    const dx = e.clientX - dragState.startX;
    const dy = e.clientY - dragState.startY;
    emit('drag', dragState.nodeId, dragState.nodeStartX + dx, dragState.nodeStartY + dy);
}

function onMouseUp(): void {
    dragState = null;
}

onMounted(() => {
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    canvasRef.value?.addEventListener('scroll', updateScrollOffset);
    updateScrollOffset();
});

onUnmounted(() => {
    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('mouseup', onMouseUp);
    canvasRef.value?.removeEventListener('scroll', updateScrollOffset);
});

</script>

<template>
    <div class="workflow-canvas-wrap flex flex-1 min-h-0" ref="canvasRef">
        <svg class="workflow-svg-lines" ref="svgRef">
            <path
                v-for="(path, i) in edgePaths"
                :key="`path-${edges[i]?.from}-${edges[i]?.to}-${i}`"
                :d="path"
                class="workflow-edge"
            />
            <circle
                v-for="(edge, i) in edges"
                :key="`circle-${edge.from}-${edge.to}-${i}`"
                v-show="portPosFromNode(edge.to, 'in')"
                :cx="portPosFromNode(edge.to, 'in')?.x ?? 0"
                :cy="portPosFromNode(edge.to, 'in')?.y ?? 0"
                r="3.2"
                class="workflow-edge-arrow"
            />
        </svg>
        <div class="workflow-canvas-inner">
            <WorkflowNode
                v-for="node in nodes"
                :key="node.id"
                :node="node"
                :node-type-def="getNodeType(node.type)"
                :selected="node.id === selectedNodeId"
                :out-port-active="connectingFromNode === node.id"
                @select="emit('select', node.id)"
                @drag-start="(e: MouseEvent) => onNodeDragStart(node.id, e)"
                @port-click="(kind) => emit('port-click', node.id, kind)"
            />
        </div>
    </div>
</template>
