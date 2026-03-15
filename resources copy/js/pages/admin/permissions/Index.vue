<script setup lang="ts">
import { Head, Link, router } from '@inertiajs/vue3';
import { Edit, Plus, Trash2 } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Heading, Text } from '@/components/ui/typography';
import AdminLayout from '@/layouts/AdminLayout.vue';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';

type Permission = { id: number; key: string; name: string; label: string | null };

type Props = { permissions: Permission[] };

defineProps<Props>();

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Admin', href: '/admin' },
    { title: 'Berechtigungen', href: '#' },
];

const destroy = (id: number) => {
    if (confirm('Berechtigung wirklich löschen? Sie wird aus allen Gruppen entfernt.')) {
        router.delete(`/admin/permissions/${id}`);
    }
};
</script>

<template>
    <AdminLayout :breadcrumbs="breadcrumbs">
        <Head title="Berechtigungen" />

        <div class="space-y-6">
            <div class="flex items-center justify-between">
                <div>
                    <Heading level="h1">Berechtigungen</Heading>
                    <Text class="mt-2" muted>Berechtigungs-Keys verwalten. Werte * und admin.access gewähren Zugriff.</Text>
                </div>
                <Link href="/admin/permissions/create">
                    <Button><Plus class="mr-2 h-4 w-4" />Neu</Button>
                </Link>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Berechtigungen</CardTitle>
                    <CardDescription>Key, Name, Label</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Key</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Label</TableHead>
                                <TableHead class="text-right">Aktionen</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow v-for="p in permissions" :key="p.id">
                                <TableCell><code class="text-sm">{{ p.key }}</code></TableCell>
                                <TableCell>{{ p.name }}</TableCell>
                                <TableCell>{{ p.label ?? '—' }}</TableCell>
                                <TableCell class="text-right">
                                    <Link :href="`/admin/permissions/${p.id}/edit`">
                                        <Button variant="ghost" size="sm"><Edit class="h-4 w-4" /></Button>
                                    </Link>
                                    <Button variant="ghost" size="sm" class="text-destructive" @click="destroy(p.id)">
                                        <Trash2 class="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                            <TableRow v-if="permissions.length === 0">
                                <TableCell colspan="4" class="text-center text-muted">Keine Berechtigungen.</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    </AdminLayout>
</template>
