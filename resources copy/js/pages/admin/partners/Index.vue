<script setup lang="ts">
import { Head, Link, router } from '@inertiajs/vue3';
import { Edit, Plus, Trash2 } from 'lucide-vue-next';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Pagination } from '@/components/ui/pagination';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Heading, Text } from '@/components/ui/typography';
import AdminLayout from '@/layouts/AdminLayout.vue';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';

type Brand = { id: number; key: string; name: string };
type User = { id: number; name: string; email: string } | null;
type Partner = {
    id: number;
    name: string;
    description: string | null;
    image_path: string | null;
    discount_percent: string;
    expires_at: string | null;
    is_active: boolean;
    brand: Brand;
    user: User;
};

type Props = {
    partners: {
        data: Partner[];
        links: { url: string | null; label: string; active: boolean }[];
    };
    brands: Brand[];
};

const props = defineProps<Props>();

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Admin', href: '/admin' },
    { title: 'Partner', href: '#' },
];

const destroy = (id: number) => {
    if (confirm('Partner wirklich löschen?')) {
        router.delete(`/admin/partners/${id}`);
    }
};

const handlePagination = (url: string) => {
    if (url) window.location.href = url;
};

const currentBrandId = () => {
    const p = new URLSearchParams(window.location.search).get('brand_id');
    return p ? parseInt(p, 10) : '';
};
</script>

<template>
    <AdminLayout :breadcrumbs="breadcrumbs">
        <Head title="Partner" />

        <div class="space-y-6">
            <div class="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <Heading level="h1">Partner</Heading>
                    <Text class="mt-2" muted>Partner pro Brand verwalten (Name, Beschreibung, Bild, Nutzer, Rabatt %, Ablauf, Aktiv)</Text>
                </div>
                <Link href="/admin/partners/create">
                    <Button><Plus class="mr-2 h-4 w-4" />Neu</Button>
                </Link>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Partner</CardTitle>
                    <CardDescription>
                        <span class="flex flex-wrap items-center gap-2">
                            Filter nach Brand:
                            <select
                                id="filter-brand"
                                class="h-10 w-48 rounded-lg border border-input bg-background px-3 py-2 text-sm"
                                :value="currentBrandId()"
                                @change="(e) => { const v = (e.target as HTMLSelectElement).value; const u = new URL(window.location.href); if (v) u.searchParams.set('brand_id', v); else u.searchParams.delete('brand_id'); u.searchParams.set('page', '1'); window.location.href = u.toString(); }"
                            >
                                <option value="">Alle</option>
                                <option v-for="b in brands" :key="b.id" :value="b.id">{{ b.name }}</option>
                            </select>
                        </span>
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Brand</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Beschreibung</TableHead>
                                <TableHead>Rabatt %</TableHead>
                                <TableHead>Nutzer</TableHead>
                                <TableHead>Ablauf</TableHead>
                                <TableHead>Aktiv</TableHead>
                                <TableHead class="text-right">Aktionen</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow v-for="p in partners.data" :key="p.id">
                                <TableCell>{{ p.brand?.name ?? '–' }}</TableCell>
                                <TableCell class="font-medium">{{ p.name }}</TableCell>
                                <TableCell class="max-w-xs truncate">{{ p.description || '–' }}</TableCell>
                                <TableCell>{{ p.discount_percent }} %</TableCell>
                                <TableCell>{{ p.user ? `${p.user.name} (${p.user.email})` : '–' }}</TableCell>
                                <TableCell>{{ p.expires_at ? new Date(p.expires_at).toLocaleDateString('de-DE') : '–' }}</TableCell>
                                <TableCell><Badge :variant="p.is_active ? 'success' : 'secondary'">{{ p.is_active ? 'Ja' : 'Nein' }}</Badge></TableCell>
                                <TableCell class="text-right">
                                    <Link :href="`/admin/partners/${p.id}/edit`">
                                        <Button variant="ghost" size="sm"><Edit class="h-4 w-4" /></Button>
                                    </Link>
                                    <Button variant="ghost" size="sm" class="text-destructive" @click="destroy(p.id)">
                                        <Trash2 class="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                            <TableRow v-if="partners.data.length === 0">
                                <TableCell colspan="8" class="text-center text-muted">Keine Partner.</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                    <Pagination v-if="partners.links.length > 3" :links="partners.links" @page-click="handlePagination" />
                </CardContent>
            </Card>
        </div>
    </AdminLayout>
</template>
