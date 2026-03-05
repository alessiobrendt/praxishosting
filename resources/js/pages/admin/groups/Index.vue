<script setup lang="ts">
import { Head, Link, router } from '@inertiajs/vue3';
import { Edit, Plus, Trash2 } from 'lucide-vue-next';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Heading, Text } from '@/components/ui/typography';
import AdminLayout from '@/layouts/AdminLayout.vue';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';

type Permission = { id: number; key: string; name: string; label: string | null };
type Group = {
    id: number;
    key: string;
    name: string;
    label: string;
    color?: string | null;
    permissions?: Permission[];
};

type Props = { groups: Group[] };

defineProps<Props>();

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Admin', href: '/admin' },
    { title: 'Gruppen', href: '#' },
];

const destroy = (id: number) => {
    if (confirm('Gruppe wirklich löschen? Benutzer-Zuweisungen gehen verloren.')) {
        router.delete(`/admin/groups/${id}`);
    }
};
</script>

<template>
    <AdminLayout :breadcrumbs="breadcrumbs">
        <Head title="Gruppen" />

        <div class="space-y-6">
            <div class="flex items-center justify-between">
                <div>
                    <Heading level="h1">Gruppen</Heading>
                    <Text class="mt-2" muted>Gruppen mit Berechtigungen verwalten. Benutzer können mehreren Gruppen angehören.</Text>
                </div>
                <Link href="/admin/groups/create">
                    <Button><Plus class="mr-2 h-4 w-4" />Neu</Button>
                </Link>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Gruppen</CardTitle>
                    <CardDescription>Key, Name, Label, Berechtigungen</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Key</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Label</TableHead>
                                <TableHead>Berechtigungen</TableHead>
                                <TableHead class="text-right">Aktionen</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow v-for="g in groups" :key="g.id">
                                <TableCell><code class="text-sm">{{ g.key }}</code></TableCell>
                                <TableCell>
                                    <span class="flex items-center gap-2">
                                        <span
                                            v-if="g.color"
                                            class="inline-block h-4 w-4 shrink-0 rounded-full border border-gray-300 dark:border-gray-600"
                                            :style="{ backgroundColor: g.color }"
                                            :title="g.color"
                                        />
                                        {{ g.name }}
                                    </span>
                                </TableCell>
                                <TableCell>{{ g.label }}</TableCell>
                                <TableCell>
                                    <span v-if="g.permissions?.length" class="flex flex-wrap gap-1">
                                        <Badge v-for="p in (g.permissions ?? []).slice(0, 5)" :key="p.id" variant="secondary" class="text-xs">
                                            {{ p.key }}
                                        </Badge>
                                        <Badge v-if="(g.permissions?.length ?? 0) > 5" variant="outline">+{{ (g.permissions?.length ?? 0) - 5 }}</Badge>
                                    </span>
                                    <span v-else class="text-muted-foreground text-sm">—</span>
                                </TableCell>
                                <TableCell class="text-right">
                                    <Link :href="`/admin/groups/${g.id}/edit`">
                                        <Button variant="ghost" size="sm"><Edit class="h-4 w-4" /></Button>
                                    </Link>
                                    <Button variant="ghost" size="sm" class="text-destructive" @click="destroy(g.id)">
                                        <Trash2 class="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                            <TableRow v-if="groups.length === 0">
                                <TableCell colspan="5" class="text-center text-muted">Keine Gruppen.</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    </AdminLayout>
</template>
