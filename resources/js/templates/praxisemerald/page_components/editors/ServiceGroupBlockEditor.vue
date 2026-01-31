<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { LayoutComponentEntry } from '@/types/layout-components';
import IconPicker from '@/templates/praxisemerald/components/IconPicker.vue';
import { Plus, Trash2 } from 'lucide-vue-next';

const props = defineProps<{
    entry: LayoutComponentEntry;
    site: { id: number; name: string; slug: string };
}>();

function ensureGroups(entry: Record<string, unknown>): { title: string; icon: string; items: string }[] {
    if (!Array.isArray(entry.groups)) entry.groups = [];
    return entry.groups as { title: string; icon: string; items: string }[];
}

function addGroup() {
    ensureGroups(props.entry.data as Record<string, unknown>).push({ title: '', icon: 'CheckCircle2', items: '' });
}

function removeGroup(i: number) {
    ensureGroups(props.entry.data as Record<string, unknown>).splice(i, 1);
}
</script>

<template>
    <div class="space-y-3">
        <div class="flex items-center justify-between">
            <Label>Leistungsgruppen</Label>
            <Button type="button" variant="ghost" size="sm" class="h-7 text-xs" @click="addGroup">
                <Plus class="mr-1 h-3 w-3" />
                Gruppe
            </Button>
        </div>
        <div class="space-y-3">
            <div
                v-for="(g, i) in ensureGroups(entry.data as Record<string, unknown>)"
                :key="i"
                class="space-y-2 rounded border p-2"
            >
                <div class="flex justify-between">
                    <span class="text-xs font-medium">Gruppe {{ i + 1 }}</span>
                    <Button type="button" variant="ghost" size="icon" class="h-7 w-7 shrink-0" @click="removeGroup(i)">
                        <Trash2 class="h-3.5 w-3.5 text-destructive" />
                    </Button>
                </div>
                <Label>Titel</Label>
                <Input v-model="g.title" placeholder="z. B. Vorsorge & Prävention" class="w-full" />
                <Label>Icon</Label>
                <IconPicker :model-value="g.icon" @update:model-value="(v) => (g.icon = v)" />
                <Label>Punkte (eine Zeile pro Punkt)</Label>
                <textarea
                    v-model="g.items"
                    placeholder="Punkt 1&#10;Punkt 2"
                    class="min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    rows="4"
                />
            </div>
        </div>
    </div>
</template>
