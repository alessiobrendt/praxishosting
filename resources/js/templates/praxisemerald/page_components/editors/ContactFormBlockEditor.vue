<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import type { LayoutComponentEntry } from '@/types/layout-components';
import { Plus, Trash2 } from 'lucide-vue-next';

const FIELD_TYPES = [
    { value: 'text', label: 'Text' },
    { value: 'email', label: 'E-Mail' },
    { value: 'tel', label: 'Telefon' },
    { value: 'textarea', label: 'Mehrzeilig' },
    { value: 'select', label: 'Auswahl' },
    { value: 'checkbox', label: 'Checkbox' },
] as const;

const props = defineProps<{
    entry: LayoutComponentEntry;
    site?: { id: number; name: string; slug: string };
}>();

function ensureFields(entry: Record<string, unknown>): Array<{ key: string; label: string; type: string; required?: boolean; options?: string[] }> {
    if (!Array.isArray(entry.fields)) entry.fields = [];
    return entry.fields as Array<{ key: string; label: string; type: string; required?: boolean; options?: string[] }>;
}

function addField() {
    const fields = ensureFields(props.entry.data as Record<string, unknown>);
    const base = 'field';
    let key = base;
    let n = 1;
    while (fields.some((f) => f.key === key)) {
        key = `${base}${n++}`;
    }
    fields.push({ key, label: '', type: 'text', required: false });
}

function removeField(i: number) {
    ensureFields(props.entry.data as Record<string, unknown>).splice(i, 1);
}

function generateKey(label: string, index: number): string {
    if (!label || typeof label !== 'string') return `field${index}`;
    return label
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '_')
        .replace(/^_|_$/g, '') || `field${index}`;
}
</script>

<template>
    <div class="space-y-4">
        <div class="space-y-2">
            <Label>Modulname</Label>
            <Input
                :model-value="(entry.data as Record<string, unknown>).moduleLabel"
                placeholder="z.B. Kontakt Impressum"
                @update:model-value="(v) => ((entry.data as Record<string, unknown>).moduleLabel = v)"
            />
            <p class="text-muted-foreground text-xs">Zur besseren Zuordnung bei mehreren Kontaktformularen</p>
        </div>
        <div class="space-y-2">
            <Label>Hinweistext (optional)</Label>
            <textarea
                :value="(entry.data as Record<string, unknown>).note"
                class="min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                placeholder="Text über dem Formular"
                rows="2"
                @input="(e) => ((entry.data as Record<string, unknown>).note = (e.target as HTMLTextAreaElement).value)"
            />
        </div>
        <div class="space-y-3">
            <div class="flex items-center justify-between">
                <Label>Formularfelder</Label>
                <Button type="button" variant="ghost" size="sm" class="h-7 text-xs" @click="addField">
                    <Plus class="mr-1 h-3 w-3" />
                    Feld
                </Button>
            </div>
            <div
                v-for="(field, i) in ensureFields(entry.data as Record<string, unknown>)"
                :key="i"
                class="space-y-2 rounded border border-input p-3"
            >
                <div class="flex justify-between">
                    <span class="text-xs font-medium">Feld {{ i + 1 }}</span>
                    <Button type="button" variant="ghost" size="icon" class="h-7 w-7 shrink-0" @click="removeField(i)">
                        <Trash2 class="h-3.5 w-3.5 text-destructive" />
                    </Button>
                </div>
                <div class="grid gap-2 sm:grid-cols-2">
                    <div class="space-y-1">
                        <Label>Bezeichnung</Label>
                        <Input
                            v-model="field.label"
                            placeholder="z.B. Name"
                            @blur="() => { if (!field.key || field.key.startsWith('field')) field.key = generateKey(field.label, i); }"
                        />
                    </div>
                    <div class="space-y-1">
                        <Label>Schlüssel</Label>
                        <Input v-model="field.key" placeholder="z.B. name" />
                    </div>
                </div>
                <div class="flex flex-wrap items-center gap-3">
                    <div class="flex items-center gap-2">
                        <Label class="text-xs">Typ</Label>
                        <Select
                            :model-value="field.type"
                            class="h-8 w-[130px]"
                            @update:model-value="(v) => (field.type = (v as string) ?? 'text')"
                        >
                            <option v-for="t in FIELD_TYPES" :key="t.value" :value="t.value">
                                {{ t.label }}
                            </option>
                        </Select>
                    </div>
                    <label class="flex items-center gap-2">
                        <input v-model="field.required" type="checkbox" class="rounded" />
                        <span class="text-sm">Pflichtfeld</span>
                    </label>
                </div>
            </div>
        </div>
    </div>
</template>
