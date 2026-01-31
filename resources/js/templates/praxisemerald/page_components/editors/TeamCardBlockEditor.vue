<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { LayoutComponentEntry } from '@/types/layout-components';
import { Plus, Trash2 } from 'lucide-vue-next';
import { inject } from 'vue';

const props = defineProps<{
    entry: LayoutComponentEntry;
    site: { id: number; name: string; slug: string };
}>();

const openMediaLibrary = inject<((callback: (url: string) => void) => void) | null>('openMediaLibrary', null);

function ensureItems(entry: Record<string, unknown>): { name: string; role: string; bio: string; image: string }[] {
    if (!Array.isArray(entry.items)) entry.items = [];
    return entry.items as { name: string; role: string; bio: string; image: string }[];
}

function addItem() {
    ensureItems(props.entry.data as Record<string, unknown>).push({ name: '', role: '', bio: '', image: '' });
}

function removeItem(i: number) {
    ensureItems(props.entry.data as Record<string, unknown>).splice(i, 1);
}
</script>

<template>
    <div class="space-y-3">
        <div class="flex items-center justify-between">
            <Label>Team-Mitglieder</Label>
            <Button type="button" variant="ghost" size="sm" class="h-7 text-xs" @click="addItem">
                <Plus class="mr-1 h-3 w-3" />
                Person
            </Button>
        </div>
        <div class="space-y-3">
            <div
                v-for="(item, i) in ensureItems(entry.data as Record<string, unknown>)"
                :key="i"
                class="space-y-2 rounded border p-2"
            >
                <div class="flex justify-between">
                    <span class="text-xs font-medium">Person {{ i + 1 }}</span>
                    <Button type="button" variant="ghost" size="icon" class="h-7 w-7 shrink-0" @click="removeItem(i)">
                        <Trash2 class="h-3.5 w-3.5 text-destructive" />
                    </Button>
                </div>
                <Label>Name</Label>
                <Input v-model="item.name" placeholder="z. B. Dr. Anna Mustermann" class="w-full" />
                <Label>Rolle</Label>
                <Input v-model="item.role" placeholder="z. B. Fachärztin für Allgemeinmedizin" class="w-full" />
                <Label>Kurzbeschreibung</Label>
                <textarea
                    v-model="item.bio"
                    placeholder="Bio"
                    class="min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    rows="2"
                />
                <Label>Bild-URL</Label>
                <div class="flex gap-2">
                    <Input v-model="item.image" placeholder="URL" class="min-w-0 flex-1" />
                    <Button
                        v-if="openMediaLibrary"
                        type="button"
                        variant="outline"
                        size="sm"
                        title="Aus Media Library"
                        @click="openMediaLibrary((url) => (item.image = url))"
                    >
                        Bild
                    </Button>
                </div>
            </div>
        </div>
    </div>
</template>
