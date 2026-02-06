<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { LayoutComponentEntry } from '@/types/layout-components';
import IconPicker from '@/templates/shared/components/IconPicker.vue';
import { Plus, Trash2 } from 'lucide-vue-next';

const props = defineProps<{
    entry: LayoutComponentEntry;
    site: { id: number; name: string; slug: string };
}>();

function ensureItems(entry: Record<string, unknown>): { title: string; icon: string; content: string; isList: boolean }[] {
    if (!Array.isArray(entry.items)) entry.items = [];
    return entry.items as { title: string; icon: string; content: string; isList: boolean }[];
}

function addItem() {
    ensureItems(props.entry.data as Record<string, unknown>).push({ title: '', icon: 'Info', content: '', isList: false });
}

function removeItem(i: number) {
    ensureItems(props.entry.data as Record<string, unknown>).splice(i, 1);
}
</script>

<template>
    <div class="space-y-3">
        <div class="flex items-center justify-between">
            <Label>Abschnitte</Label>
            <Button type="button" variant="ghost" size="sm" class="h-7 text-xs" @click="addItem">
                <Plus class="mr-1 h-3 w-3" />
                Abschnitt
            </Button>
        </div>
        <div class="space-y-3">
            <div
                v-for="(item, i) in ensureItems(entry.data as Record<string, unknown>)"
                :key="i"
                class="space-y-2 rounded border p-2"
            >
                <div class="flex justify-between">
                    <span class="text-xs font-medium">Abschnitt {{ i + 1 }}</span>
                    <Button type="button" variant="ghost" size="icon" class="h-7 w-7 shrink-0" @click="removeItem(i)">
                        <Trash2 class="h-3.5 w-3.5 text-destructive" />
                    </Button>
                </div>
                <Label>Titel</Label>
                <Input v-model="item.title" placeholder="z. B. Anfahrt" class="w-full" />
                <Label>Icon</Label>
                <IconPicker :model-value="item.icon" @update:model-value="(v) => (item.icon = v)" />
                <Label>Inhalt (eine Zeile = ein Absatz/Listenpunkt)</Label>
                <textarea
                    v-model="item.content"
                    placeholder="Zeile 1&#10;Zeile 2"
                    class="min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    rows="4"
                />
                <label class="flex items-center gap-2">
                    <input v-model="item.isList" type="checkbox" class="rounded" />
                    <span class="text-sm">Als Liste anzeigen</span>
                </label>
            </div>
        </div>
    </div>
</template>
