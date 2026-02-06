<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { LayoutComponentEntry } from '@/types/layout-components';
import { Plus, Trash2 } from 'lucide-vue-next';

const props = defineProps<{
    entry: LayoutComponentEntry;
    site: { id: number; name: string; slug: string };
}>();

function ensureItems(entry: Record<string, unknown>): { question: string; answer: string }[] {
    if (!Array.isArray(entry.items)) entry.items = [];
    return entry.items as { question: string; answer: string }[];
}

function addItem() {
    ensureItems(props.entry.data as Record<string, unknown>).push({ question: '', answer: '' });
}

function removeItem(i: number) {
    ensureItems(props.entry.data as Record<string, unknown>).splice(i, 1);
}
</script>

<template>
    <div class="space-y-3">
        <div class="flex items-center justify-between">
            <Label>Frage / Antwort</Label>
            <Button type="button" variant="ghost" size="sm" class="h-7 text-xs" @click="addItem">
                <Plus class="mr-1 h-3 w-3" />
                Eintrag
            </Button>
        </div>
        <div class="space-y-3">
            <div
                v-for="(item, i) in ensureItems(entry.data as Record<string, unknown>)"
                :key="i"
                class="space-y-2 rounded border p-2"
            >
                <div class="flex justify-between">
                    <span class="text-xs font-medium">Eintrag {{ i + 1 }}</span>
                    <Button type="button" variant="ghost" size="icon" class="h-7 w-7 shrink-0" @click="removeItem(i)">
                        <Trash2 class="h-3.5 w-3.5 text-destructive" />
                    </Button>
                </div>
                <Label>Frage</Label>
                <Input v-model="item.question" placeholder="Frage" class="w-full" />
                <Label>Antwort</Label>
                <textarea
                    v-model="item.answer"
                    placeholder="Antwort"
                    class="min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    rows="2"
                />
            </div>
        </div>
    </div>
</template>
