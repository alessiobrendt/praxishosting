import { ref, computed, watch } from 'vue';
import type { Workflow, WorkflowNode, WorkflowEdge } from '@/types/workflow';
import {
    NODE_TYPES,
    DEFAULT_STEP_TYPES,
    type NodeTypeDef,
} from '@/types/workflow';

const STORAGE_KEY = 'wf_builder_current';

function getCsrfToken(): string {
    const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
    return match ? decodeURIComponent(match[1]) : '';
}

function uid(prefix = 'n'): string {
    return prefix + Math.random().toString(16).slice(2, 10);
}

function defaultWorkflow(): Workflow {
    const id = 'wf_' + Math.random().toString(16).slice(2, 8);
    return {
        meta: {
            id,
            name: 'Patienten-Workflow (Prototyp)',
            version: '0.1.0',
        },
        variables_schema: {
            'patient.name': 'string',
            'patient.phone': 'string',
            'patient.email': 'string',
            'appointment.id': 'string',
            'appointment.start': 'datetime',
            'docs.missing': 'array',
        },
        nodes: [],
        edges: [],
    };
}

function loadLocal(): Workflow | null {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return null;
        const data = JSON.parse(raw) as Workflow;
        if (!data?.nodes || !data?.edges || !data?.meta) return null;
        return data;
    } catch {
        return null;
    }
}

function saveLocal(workflow: Workflow): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(workflow));
}

export function useWorkflowBuilder() {
    const workflow = ref<Workflow>(loadLocal() ?? defaultWorkflow());
    const selectedNodeId = ref<string | null>(null);
    const connectingFromNode = ref<string | null>(null);
    const runLog = ref<string>('');

    const selectedNode = computed(() => {
        if (!selectedNodeId.value) return null;
        return workflow.value.nodes.find((n) => n.id === selectedNodeId.value) ?? null;
    });

    function getNodeType(type: string): NodeTypeDef | undefined {
        return NODE_TYPES.find((t) => t.type === type);
    }

    function addNode(def: NodeTypeDef): void {
        const node: WorkflowNode = {
            id: uid('n'),
            type: def.type,
            label: def.label,
            x: 60 + Math.random() * 160,
            y: 60 + Math.random() * 160,
            config: JSON.parse(JSON.stringify(def.defaults ?? {})),
        };
        workflow.value.nodes.push(node);
        selectedNodeId.value = node.id;
        saveLocal(workflow.value);
    }

    function deleteSelectedNode(): void {
        if (!selectedNodeId.value) return;
        const id = selectedNodeId.value;
        workflow.value = {
            ...workflow.value,
            nodes: workflow.value.nodes.filter((n) => n.id !== id),
            edges: workflow.value.edges.filter(
                (e) => e.from !== id && e.to !== id,
            ),
        };
        selectedNodeId.value = null;
        saveLocal(workflow.value);
    }

    function updateNodePosition(nodeId: string, x: number, y: number): void {
        const node = workflow.value.nodes.find((n) => n.id === nodeId);
        if (node) {
            node.x = Math.max(10, x);
            node.y = Math.max(10, y);
            saveLocal(workflow.value);
        }
    }

    function updateNodeLabel(nodeId: string, label: string): void {
        const node = workflow.value.nodes.find((n) => n.id === nodeId);
        if (node) {
            node.label = label;
            saveLocal(workflow.value);
        }
    }

    function updateNodeConfig(nodeId: string, config: Record<string, unknown>): void {
        const node = workflow.value.nodes.find((n) => n.id === nodeId);
        if (node) {
            node.config = config;
            saveLocal(workflow.value);
        }
    }

    function connectNodes(fromNodeId: string, toNodeId: string): void {
        if (fromNodeId === toNodeId) return;
        const exists = workflow.value.edges.some(
            (e) => e.from === fromNodeId && e.to === toNodeId,
        );
        if (!exists) {
            workflow.value.edges = [
                ...workflow.value.edges,
                { from: fromNodeId, to: toNodeId },
            ];
            saveLocal(workflow.value);
        }
    }

    function newWorkflow(): void {
        workflow.value = defaultWorkflow();
        selectedNodeId.value = null;
        connectingFromNode.value = null;
        saveLocal(workflow.value);
    }

    function loadDefaultTemplate(): void {
        if (workflow.value.nodes.length > 0) return;
        let x = 60;
        const yBase = 60;
        const colW = 320;
        const rowH = 160;
        DEFAULT_STEP_TYPES.forEach((type, i) => {
            const def = NODE_TYPES.find((d) => d.type === type);
            if (!def) return;
            const col = i % 3;
            const row = Math.floor(i / 3);
            workflow.value.nodes.push({
                id: `step${i + 1}`,
                type: def.type,
                label: def.label,
                x: x + col * colW,
                y: yBase + row * rowH,
                config: JSON.parse(JSON.stringify(def.defaults)),
            });
        });
        for (let i = 0; i < DEFAULT_STEP_TYPES.length - 1; i++) {
            workflow.value.edges.push({
                from: `step${i + 1}`,
                to: `step${i + 2}`,
            });
        }
        saveLocal(workflow.value);
    }

    function autoLayout(): void {
        const starts = workflow.value.nodes.filter((n) =>
            n.type.startsWith('trigger.'),
        );
        const startId = starts[0]?.id ?? workflow.value.nodes[0]?.id;
        if (!startId) return;

        const adj = new Map<string, string[]>();
        workflow.value.nodes.forEach((n) => adj.set(n.id, []));
        workflow.value.edges.forEach((e) => {
            if (adj.has(e.from)) adj.get(e.from)!.push(e.to);
        });

        const level = new Map<string, number>();
        level.set(startId, 0);
        const q = [startId];
        while (q.length > 0) {
            const cur = q.shift()!;
            const l = level.get(cur) ?? 0;
            for (const nxt of adj.get(cur) ?? []) {
                if (!level.has(nxt)) {
                    level.set(nxt, l + 1);
                    q.push(nxt);
                }
            }
        }

        const groups: Record<number, WorkflowNode[]> = {};
        workflow.value.nodes.forEach((n) => {
            const l = level.has(n.id) ? level.get(n.id)! : 99;
            groups[l] = groups[l] ?? [];
            groups[l].push(n);
        });
        const cols = Object.keys(groups)
            .map(Number)
            .sort((a, b) => a - b);
        const x0 = 40;
        const y0 = 40;
        const colW = 320;
        const rowH = 160;
        cols.forEach((l, ci) =>
            groups[l].forEach((n, ri) => {
                n.x = x0 + ci * colW;
                n.y = y0 + ri * rowH;
            }),
        );
        saveLocal(workflow.value);
    }

    function runSimulation(): void {
        runLog.value = '';
        const log = (s: string) => (runLog.value += s + '\n');

        if (workflow.value.nodes.length === 0) {
            log('Kein Workflow vorhanden.');
            return;
        }

        const starts = workflow.value.nodes.filter((n) =>
            n.type.startsWith('trigger.'),
        );
        const startIds = (starts.length ? starts : [workflow.value.nodes[0]]).map(
            (n) => n.id,
        );

        const nexts = new Map<string, string[]>();
        workflow.value.nodes.forEach((n) => nexts.set(n.id, []));
        workflow.value.edges.forEach((e) => {
            if (nexts.has(e.from)) nexts.get(e.from)!.push(e.to);
        });

        const visited = new Set<string>();
        const ctx = {
            patient: {
                name: 'Test Patient',
                phone: '+49...',
                email: 'test@example.com',
            },
            docs: { missing: ['Anamnesebogen'] },
            appointment: { start: '2026-02-18T10:00:00' },
        };

        function execNode(nid: string, depth: number): void {
            if (visited.has(nid)) return;
            visited.add(nid);
            const n = workflow.value.nodes.find((node) => node.id === nid);
            if (!n) return;
            log('  '.repeat(depth) + `• ${n.label}  [${n.type}]`);
            if (n.type === 'timer.precheck_docs') {
                const missing = (ctx.docs as { missing?: string[] }).missing ?? [];
                if (missing.length > 0) {
                    log(
                        '  '.repeat(depth + 1) +
                            `↳ Missing docs: ${missing.join(', ')}`,
                    );
                    log(
                        '  '.repeat(depth + 1) +
                            `↳ Message: ${(n.config?.missing_docs_message as string) ?? ''}`,
                    );
                } else {
                    log('  '.repeat(depth + 1) + '↳ Docs complete.');
                }
            }
            for (const t of nexts.get(nid) ?? []) execNode(t, depth + 1);
        }

        log('Run Simulation gestartet (Demo-Kontext).');
        startIds.forEach((id) => execNode(id, 0));
        log('— Ende —');
    }

    async function saveToServer(): Promise<{ ok: boolean; id?: string; error?: string }> {
        const w = workflow.value;
        if (!w.meta.id) w.meta.id = 'wf_' + Math.random().toString(16).slice(2, 8);
        const res = await fetch('/workflow-builder/api/save', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-XSRF-TOKEN': getCsrfToken(),
            },
            body: JSON.stringify(w),
        });
        const text = await res.text();
        let j: { ok: boolean; id?: string; error?: string };
        try {
            j = JSON.parse(text);
        } catch {
            return { ok: false, error: res.status === 419 ? 'Session abgelaufen – Seite neu laden.' : `Fehler ${res.status}` };
        }
        if (j.ok && j.id) w.meta.id = j.id;
        return j;
    }

    async function loadFromServer(id: string): Promise<{
        ok: boolean;
        data?: Workflow;
        error?: string;
    }> {
        const res = await fetch(
            `/workflow-builder/api/load/${encodeURIComponent(id)}`,
        );
        const text = await res.text();
        let j: { ok: boolean; data?: Workflow; error?: string };
        try {
            j = JSON.parse(text);
        } catch {
            return { ok: false, error: res.status === 419 ? 'Session abgelaufen – Seite neu laden.' : `Fehler ${res.status}` };
        }
        if (j.ok && j.data) {
            workflow.value = j.data;
            selectedNodeId.value = null;
            connectingFromNode.value = null;
            saveLocal(workflow.value);
        }
        return j;
    }

    async function listWorkflows(): Promise<{ ok: boolean; ids?: string[] }> {
        const res = await fetch('/workflow-builder/api/list');
        const text = await res.text();
        try {
            return JSON.parse(text) as { ok: boolean; ids?: string[] };
        } catch {
            return { ok: false };
        }
    }

    watch(
        workflow,
        (w) => saveLocal(w),
        { deep: true },
    );

    return {
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
    };
}
