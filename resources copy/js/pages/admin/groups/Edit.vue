<script setup lang="ts">
import { Head, Link, useForm } from '@inertiajs/vue3';
import { Search } from 'lucide-vue-next';
import { computed, ref } from 'vue';
import InputError from '@/components/InputError.vue';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Heading } from '@/components/ui/typography';
import AdminLayout from '@/layouts/AdminLayout.vue';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';

type Permission = { id: number; key: string; name: string; label: string | null; category: string | null };
type Group = {
    id: number;
    key: string;
    name: string;
    label: string;
    color?: string | null;
    permissions?: { id: number }[];
};
type GroupForCopy = { id: number; name: string; label: string; permission_ids: number[] };

type Props = { group: Group; permissions: Permission[]; groupsForCopy: GroupForCopy[] };

const props = defineProps<Props>();

const copyFromModalOpen = ref(false);
const selectedGroupIdForCopy = ref<number | ''>('');

const form = useForm({
    key: props.group.key,
    name: props.group.name,
    label: props.group.label,
    color: (props.group.color ?? '') as string,
    permission_ids: (props.group.permissions ?? []).map((p) => p.id),
});

const permissionSearch = ref('');

const categories = computed(() => {
    const set = new Set<string>();
    for (const p of props.permissions) {
        set.add(p.category ?? 'Sonstiges');
    }
    return Array.from(set).sort();
});

const permissionsByCategory = computed(() => {
    const map = new Map<string, Permission[]>();
    for (const p of props.permissions) {
        const cat = p.category ?? 'Sonstiges';
        if (!map.has(cat)) map.set(cat, []);
        map.get(cat)!.push(p);
    }
    for (const arr of map.values()) arr.sort((a, b) => a.key.localeCompare(b.key));
    return map;
});

const filteredPermissionsByCategory = computed(() => {
    const q = permissionSearch.value.trim().toLowerCase();
    if (!q) return permissionsByCategory.value;
    const map = new Map<string, Permission[]>();
    for (const [cat, perms] of permissionsByCategory.value) {
        const filtered = perms.filter(
            (p) =>
                p.key.toLowerCase().includes(q) ||
                (p.name && p.name.toLowerCase().includes(q)) ||
                (p.label && p.label.toLowerCase().includes(q)),
        );
        if (filtered.length > 0) map.set(cat, filtered);
    }
    return map;
});

const defaultTab = computed(() => categories.value[0] ?? 'Sonstiges');

function setPermission(id: number, checked: boolean) {
    if (checked) {
        form.permission_ids = [...form.permission_ids, id];
    } else {
        form.permission_ids = form.permission_ids.filter((x) => x !== id);
    }
}

function selectAllPermissions() {
    const ids = props.permissions.map((p) => p.id);
    form.permission_ids = [...ids];
}

function copyFromGroup() {
    const g = props.groupsForCopy.find((x) => x.id === selectedGroupIdForCopy.value);
    if (g) {
        form.permission_ids = [...g.permission_ids];
        copyFromModalOpen.value = false;
        selectedGroupIdForCopy.value = '';
    }
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Admin', href: '/admin' },
    { title: 'Gruppen', href: '/admin/groups' },
    { title: props.group.name, href: '#' },
];
</script>

<template>
    <AdminLayout :breadcrumbs="breadcrumbs">
        <Head :title="`Gruppe: ${group.name}`" />

        <div class="space-y-6">
            <Heading level="h1">Gruppe bearbeiten</Heading>

            <Card class="w-full">
                <CardHeader>
                    <CardTitle>{{ group.name }}</CardTitle>
                    <CardDescription>Key, Name, Label, Farbe und zugewiesene Berechtigungen</CardDescription>
                </CardHeader>
                <form @submit.prevent="form.put(`/admin/groups/${group.id}`)">
                    <CardContent class="space-y-4">
                        <div class="grid gap-4 sm:grid-cols-2">
                            <div class="space-y-2">
                                <Label for="key">Key</Label>
                                <Input id="key" v-model="form.key" :aria-invalid="!!form.errors.key" />
                                <InputError :message="form.errors.key" />
                            </div>
                            <div class="space-y-2">
                                <Label for="name">Name</Label>
                                <Input id="name" v-model="form.name" required :aria-invalid="!!form.errors.name" />
                                <InputError :message="form.errors.name" />
                            </div>
                        </div>
                        <div class="grid gap-4 sm:grid-cols-2">
                            <div class="space-y-2">
                                <Label for="label">Label</Label>
                                <Input id="label" v-model="form.label" required :aria-invalid="!!form.errors.label" />
                                <InputError :message="form.errors.label" />
                            </div>
                            <div class="space-y-2">
                                <Label for="color">Farbe (für Badge)</Label>
                                <div class="flex gap-2">
                                    <input
                                        id="color"
                                        :value="form.color || '#3b82f6'"
                                        type="color"
                                        class="h-10 w-14 cursor-pointer rounded border border-gray-300 bg-white p-1 dark:border-gray-600 dark:bg-gray-800"
                                        :class="{ 'opacity-50': !form.color }"
                                        @input="form.color = ($event.target as HTMLInputElement).value"
                                    />
                                    <Input
                                        v-model="form.color"
                                        type="text"
                                        placeholder="#3b82f6"
                                        maxlength="7"
                                        class="font-mono"
                                        :aria-invalid="!!form.errors.color"
                                    />
                                </div>
                                <InputError :message="form.errors.color" />
                            </div>
                        </div>
                        <div class="space-y-2">
                            <Label>Berechtigungen</Label>
                            <div class="relative mb-2">
                                <Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                <Input
                                    v-model="permissionSearch"
                                    type="search"
                                    placeholder="In allen Kategorien durchsuchen (Key, Name, Label)…"
                                    class="pl-9"
                                />
                            </div>
                            <div class="mb-3 flex flex-wrap items-center gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    @click.prevent="selectAllPermissions"
                                >
                                    Alle Berechtigungen anwählen
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    @click.prevent="copyFromModalOpen = true"
                                >
                                    Berechtigungen von anderer Rolle übernehmen
                                </Button>
                                <Dialog v-model:open="copyFromModalOpen">
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Berechtigungen von Rolle übernehmen</DialogTitle>
                                            <DialogDescription>
                                                Wählen Sie eine Gruppe. Deren Berechtigungen ersetzen die aktuell ausgewählten.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <div v-if="groupsForCopy.length" class="space-y-4 py-4">
                                            <div class="space-y-2">
                                                <Label for="copy-from-group">Gruppe</Label>
                                                <select
                                                    id="copy-from-group"
                                                    v-model="selectedGroupIdForCopy"
                                                    class="flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800"
                                                >
                                                    <option value="">Bitte wählen…</option>
                                                    <option v-for="g in groupsForCopy" :key="g.id" :value="g.id">
                                                        {{ g.label || g.name }}
                                                    </option>
                                                </select>
                                            </div>
                                            <DialogFooter>
                                                <Button type="button" variant="outline" @click="copyFromModalOpen = false">
                                                    Abbrechen
                                                </Button>
                                                <Button
                                                    type="button"
                                                    :disabled="selectedGroupIdForCopy === ''"
                                                    @click="copyFromGroup"
                                                >
                                                    Übernehmen
                                                </Button>
                                            </DialogFooter>
                                        </div>
                                        <p v-else class="py-4 text-sm text-gray-500 dark:text-gray-400">
                                            Keine anderen Gruppen vorhanden.
                                        </p>
                                    </DialogContent>
                                </Dialog>
                            </div>
                            <Tabs :default-tab="defaultTab" class="w-full">
                                <TabsList class="mb-2 w-full flex-wrap gap-1">
                                    <TabsTrigger
                                        v-for="cat in categories"
                                        :key="cat"
                                        :value="cat"
                                        class="text-xs"
                                    >
                                        {{ cat }}
                                    </TabsTrigger>
                                </TabsList>
                                <div class="max-h-64 overflow-y-auto rounded-md border p-3">
                                    <TabsContent
                                        v-for="cat in categories"
                                        :key="cat"
                                        :value="cat"
                                        class="mt-0"
                                    >
                                        <div v-if="filteredPermissionsByCategory.get(cat)?.length" class="space-y-2">
                                            <div
                                                v-for="p in filteredPermissionsByCategory.get(cat)"
                                                :key="p.id"
                                                class="flex items-center gap-2"
                                            >
                                                <Checkbox
                                                    :id="`perm-${p.id}`"
                                                    :model-value="form.permission_ids.includes(p.id)"
                                                    @update:model-value="(v: boolean) => setPermission(p.id, v)"
                                                />
                                                <label :for="`perm-${p.id}`" class="cursor-pointer text-sm">
                                                    <code>{{ p.key }}</code> — {{ p.name }}
                                                </label>
                                            </div>
                                        </div>
                                        <p v-else class="text-sm text-gray-500 dark:text-gray-400">
                                            Keine Berechtigungen in dieser Kategorie
                                            {{ permissionSearch ? ' (Filter aktiv)' : '' }}.
                                        </p>
                                    </TabsContent>
                                </div>
                            </Tabs>
                            <InputError :message="form.errors.permission_ids" />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" :disabled="form.processing">Speichern</Button>
                        <Link href="/admin/groups"><Button type="button" variant="outline">Abbrechen</Button></Link>
                    </CardFooter>
                </form>
            </Card>
        </div>
    </AdminLayout>
</template>
