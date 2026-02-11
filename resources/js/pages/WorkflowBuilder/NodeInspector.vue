<script setup lang="ts">
import { ref, watch } from 'vue';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { WorkflowNode } from '@/types/workflow';

const props = defineProps<{
    node: WorkflowNode | null;
}>();

const emit = defineEmits<{
    (e: 'update:label', value: string): void;
    (e: 'update:config', value: Record<string, unknown>): void;
}>();

const labelInput = ref('');
const configInput = ref('');

watch(
    () => props.node,
    (n) => {
        if (n) {
            labelInput.value = n.label;
            configInput.value = JSON.stringify(n.config, null, 2);
        }
    },
    { immediate: true },
);

function onLabelInput(): void {
    if (props.node) emit('update:label', labelInput.value);
}

function onConfigInput(): void {
    if (!props.node) return;
    try {
        const parsed = JSON.parse(configInput.value) as Record<string, unknown>;
        emit('update:config', parsed);
    } catch {
        // Invalid JSON, ignore
    }
}
</script>

<template>
    <div class="space-y-4">
        <div v-if="!node" class="text-sm text-gray-600 dark:text-gray-400">
            Kein Node ausgewählt. Wähle einen Node auf dem Canvas aus.
        </div>
        <template v-else>
            <div class="space-y-2">
                <Label>Titel</Label>
                <Input
                    :model-value="labelInput"
                    @update:model-value="(v: string) => { labelInput = v; emit('update:label', v); }"
                />
            </div>
            <div class="space-y-2">
                <Label>Typ</Label>
                <Input :model-value="node.type" disabled />
            </div>
            <div class="space-y-2">
                <Label>Config (JSON)</Label>
                <Textarea
                    :model-value="configInput"
                    class="font-mono text-xs"
                    rows="10"
                    spellcheck="false"
                    @update:model-value="(v: string) => { configInput = v; onConfigInput(); }"
                />
            </div>
            <div class="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
                <p class="font-semibold text-gray-900 dark:text-gray-100">Tipps</p>
                <p class="mt-1">
                    • Timer: ISO 8601 Dauer, z.B. <code>P1D</code> (1 Tag),
                    <code>PT3H</code> (3 Std.).
                </p>
                <p class="mt-1">
                    • Texte/Fragen für Fonio/eSign kannst du in
                    <code>config</code> ablegen.
                </p>
            </div>
        </template>
    </div>
</template>
