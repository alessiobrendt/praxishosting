<script setup lang="ts">
import { Head } from '@inertiajs/vue3';
import { onMounted, onUnmounted } from 'vue';
import AppLayout from '@/layouts/AppLayout.vue';
import { useWorkflowBuilder } from '@/composables/useWorkflowBuilder';
import { dashboard } from '@/routes';
import { Button } from '@/components/ui/button';
import NodePalette from './NodePalette.vue';
import WorkflowCanvas from './WorkflowCanvas.vue';
import NodeInspector from './NodeInspector.vue';
import type { BreadcrumbItem } from '@/types';
import { Plus, Download, Upload, Save, FolderOpen, Play, LayoutGrid, Trash2 } from 'lucide-vue-next';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Workflow Builder', href: '#' },
];

const {
    workflow,
    selectedNodeId,
    selectedNode,
    connectingFromNode,
    runLog,
    NODE_TYPES,
    getNodeType,
    addNode,
    deleteSelectedNode,
    updateNodePosition,
    updateNodeLabel,
    updateNodeConfig,
    connectNodes,
    newWorkflow,
    loadDefaultTemplate,
    autoLayout,
    runSimulation,
    saveToServer,
    loadFromServer,
    listWorkflows,
} = useWorkflowBuilder();

function onPortClick(nodeId: string, kind: 'in' | 'out'): void {
    if (kind === 'out') {
        connectingFromNode.value = connectingFromNode.value === nodeId ? null : nodeId;
    } else {
        if (connectingFromNode.value) {
            connectNodes(connectingFromNode.value, nodeId);
            connectingFromNode.value = null;
        }
    }
}

function handleCanvasDrag(nodeId: string, x: number, y: number): void {
    updateNodePosition(nodeId, x, y);
}

function exportJson(): void {
    const blob = new Blob([JSON.stringify(workflow.value, null, 2)], {
        type: 'application/json',
    });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = (workflow.value.meta.id ?? 'workflow') + '.json';
    a.click();
    URL.revokeObjectURL(a.href);
}

function importJson(): void {
    const inp = document.createElement('input');
    inp.type = 'file';
    inp.accept = 'application/json';
    inp.onchange = async () => {
        const f = inp.files?.[0];
        if (!f) return;
        const text = await f.text();
        try {
            const data = JSON.parse(text) as typeof workflow.value;
            if (!data?.nodes || !data?.edges) throw new Error('Ungültiges Workflow-Format');
            workflow.value = data;
            selectedNodeId.value = null;
            connectingFromNode.value = null;
        } catch (e) {
            alert('Import fehlgeschlagen: ' + (e instanceof Error ? e.message : String(e)));
        }
    };
    inp.click();
}

async function handleSaveServer(): Promise<void> {
    const result = await saveToServer();
    if (result.ok) {
        alert('Gespeichert als: ' + result.id);
    } else {
        alert('Save fehlgeschlagen: ' + (result.error ?? 'Unbekannter Fehler'));
    }
}

async function handleLoadServer(): Promise<void> {
    const result = await listWorkflows();
    if (!result.ok || !result.ids?.length) {
        alert('Keine Workflows vorhanden.');
        return;
    }
    const id = prompt(
        'Welche ID laden?\nVerfügbar: ' + result.ids.join(', '),
        workflow.value.meta.id ?? 'default',
    );
    if (!id) return;
    const loadResult = await loadFromServer(id);
    if (!loadResult.ok) {
        alert('Load fehlgeschlagen: ' + (loadResult.error ?? 'Unbekannter Fehler'));
    }
}

const workflowName = (): string => {
    const m = workflow.value.meta;
    return m?.name ? `${m.name} (${m.id})` : '';
};

function onKeydown(e: KeyboardEvent): void {
    if (e.key !== 'Delete' && e.key !== 'Backspace') return;
    const target = e.target as HTMLElement;
    if (target?.closest('input, textarea') || target?.isContentEditable) return;
    if (!selectedNodeId.value) return;
    e.preventDefault();
    deleteSelectedNode();
}

onMounted(() => {
    if (workflow.value.nodes.length === 0) {
        loadDefaultTemplate();
    }
    window.addEventListener('keydown', onKeydown);
});

onUnmounted(() => {
    window.removeEventListener('keydown', onKeydown);
});
</script>

<template>
    <AppLayout :breadcrumbs="breadcrumbs">
        <Head title="Workflow Builder" />

        <div
            class="flex flex-col min-h-0 -m-4 sm:-m-6 h-[calc(100vh-6rem)]"
        >
            <div
                class="workflow-builder flex flex-1 min-h-0 flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-modern dark:border-gray-800 dark:bg-gray-900"
            >
                <header class="flex h-14 shrink-0 items-center gap-3 border-b border-gray-200 bg-white px-4 dark:border-gray-800 dark:bg-gray-900">
                    <div class="flex-1 font-semibold text-gray-900 dark:text-gray-100">Workflow Builder</div>
                    <span class="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
                        Prototyp • Vue • Drag & Drop
                    </span>
                    <div class="ml-auto flex items-center gap-2">
                        <span class="text-xs text-gray-600 dark:text-gray-400">
                            {{ workflowName() }}
                            <span v-if="workflow.edges.length" class="ml-1 opacity-75">
                                ({{ workflow.edges.length }} Verbindung{{ workflow.edges.length !== 1 ? 'en' : '' }})
                            </span>
                        </span>
                        <div class="h-5 w-px bg-gray-200 dark:bg-gray-700" />
                        <Button variant="outline" size="sm" @click="newWorkflow">
                            <Plus class="mr-1.5 h-3.5 w-3.5" />
                            Neu
                        </Button>
                        <Button variant="outline" size="sm" @click="exportJson">
                            <Download class="mr-1.5 h-3.5 w-3.5" />
                            JSON Export
                        </Button>
                        <Button variant="outline" size="sm" @click="importJson">
                            <Upload class="mr-1.5 h-3.5 w-3.5" />
                            JSON Import
                        </Button>
                        <Button variant="outline" size="sm" class="border-emerald-500/50 bg-emerald-500/10 hover:border-emerald-500 dark:border-emerald-500/50 dark:bg-emerald-500/10" @click="handleSaveServer">
                            <Save class="mr-1.5 h-3.5 w-3.5" />
                            Server speichern
                        </Button>
                        <Button variant="outline" size="sm" @click="handleLoadServer">
                            <FolderOpen class="mr-1.5 h-3.5 w-3.5" />
                            Server laden
                        </Button>
                    </div>
                </header>

                <div class="flex min-h-0 flex-1">
                    <!-- Left: Palette + Actions -->
                    <aside class="flex w-[280px] shrink-0 flex-col overflow-auto border-r border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
                        <div class="border-b border-gray-200 p-3 dark:border-gray-800">
                            <NodePalette :node-types="NODE_TYPES" @add="addNode" />
                        </div>
                        <div class="border-b border-gray-200 p-3 dark:border-gray-800">
                            <h3 class="mb-2 text-sm font-semibold text-gray-900 dark:text-gray-100">Aktionen</h3>
                            <div class="flex flex-wrap gap-2">
                                <Button variant="outline" size="sm" class="w-full sm:w-auto" @click="runSimulation">
                                    <Play class="mr-1.5 h-3.5 w-3.5" />
                                    Run simulieren
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    class="w-full sm:w-auto"
                                    :disabled="!selectedNodeId"
                                    @click="deleteSelectedNode"
                                >
                                    <Trash2 class="mr-1.5 h-3.5 w-3.5" />
                                    Node löschen
                                </Button>
                                <Button variant="outline" size="sm" class="w-full sm:w-auto" @click="autoLayout">
                                    <LayoutGrid class="mr-1.5 h-3.5 w-3.5" />
                                    Auto-Layout
                                </Button>
                            </div>
                            <p class="mt-2 text-xs text-gray-600 dark:text-gray-400">
                                Verbinden: 1. „out“ eines Nodes klicken (wird hervorgehoben) → 2. „in“ eines anderen Nodes klicken.
                            </p>
                            <p
                                v-if="connectingFromNode"
                                class="mt-2 rounded-md border border-emerald-200 bg-emerald-50 px-2 py-1.5 text-xs font-medium text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-200"
                            >
                                Verbindungsmodus: Jetzt „in“ des Ziel-Nodes klicken.
                            </p>
                        </div>
                    </aside>

                    <!-- Center: Canvas -->
                    <main class="flex min-h-0 min-w-0 flex-1 flex-col">
                        <WorkflowCanvas
                            :nodes="workflow.nodes"
                            :edges="workflow.edges"
                            :selected-node-id="selectedNodeId"
                            :connecting-from-node="connectingFromNode"
                            :get-node-type="getNodeType"
                            @select="selectedNodeId = $event"
                            @port-click="onPortClick"
                            @drag="handleCanvasDrag"
                        />
                    </main>

                    <!-- Right: Inspector + Run Log -->
                    <aside class="flex w-[360px] shrink-0 flex-col overflow-auto border-l border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
                        <div class="border-b border-gray-200 p-3 dark:border-gray-800">
                            <h3 class="mb-2 text-sm font-semibold text-gray-900 dark:text-gray-100">Node Einstellungen</h3>
                            <NodeInspector
                                :node="selectedNode"
                                @update:label="(v) => selectedNodeId && updateNodeLabel(selectedNodeId, v)"
                                @update:config="(v) => selectedNodeId && updateNodeConfig(selectedNodeId, v)"
                            />
                        </div>
                        <div class="flex-1 overflow-auto p-3">
                            <h3 class="mb-2 text-sm font-semibold text-gray-900 dark:text-gray-100">Run Log</h3>
                            <p class="mb-2 text-xs text-gray-600 dark:text-gray-400">Nur Simulation (noch keine echten API Calls).</p>
                            <pre
                                class="max-h-[260px] overflow-auto rounded-lg border border-gray-200 bg-gray-50 p-3 font-mono text-xs text-gray-900 whitespace-pre-wrap dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                            >{{ runLog || '(leer)' }}</pre>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    </AppLayout>
</template>
