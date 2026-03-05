<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3';
import { Edit } from 'lucide-vue-next';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Heading, Text } from '@/components/ui/typography';
import AdminLayout from '@/layouts/AdminLayout.vue';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';

type HostingPlan = {
    id: number;
    name: string;
    plesk_package_name: string;
    disk_gb: number;
    traffic_gb: number;
    domains: number;
    subdomains: number;
    mailboxes: number;
    databases: number;
    price: string;
    stripe_price_id: string | null;
    is_active: boolean;
    product?: { id: number } | null;
    webspace_accounts?: Array<{ id: number; domain: string; status: string }>;
};

type Props = {
    hostingPlan: HostingPlan;
};

const props = defineProps<Props>();

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Webspace-Pakete', href: '/admin/hosting-plans' },
    { title: props.hostingPlan.name, href: '#' },
];
</script>

<template>
    <AdminLayout :breadcrumbs="breadcrumbs">
        <Head :title="hostingPlan.name" />

        <div class="space-y-6">
            <div class="flex items-center justify-between">
                <div>
                    <Heading level="h1">{{ hostingPlan.name }}</Heading>
                    <Text class="mt-2" muted>
                        Plesk-Paket: {{ hostingPlan.plesk_package_name }}
                    </Text>
                </div>
                <Link :href="`/admin/hosting-plans/${hostingPlan.id}/edit`">
                    <Button>
                        <Edit class="mr-2 h-4 w-4" />
                        Bearbeiten
                    </Button>
                </Link>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Specs</CardTitle>
                    <CardDescription>Limits und Preis</CardDescription>
                </CardHeader>
                <CardContent class="space-y-2">
                    <div class="flex justify-between py-2 border-b">
                        <span class="text-muted-foreground">Webspace</span>
                        <span>{{ hostingPlan.disk_gb }} GB NVMe</span>
                    </div>
                    <div class="flex justify-between py-2 border-b">
                        <span class="text-muted-foreground">Traffic</span>
                        <span>{{ hostingPlan.traffic_gb }} GB/Monat</span>
                    </div>
                    <div class="flex justify-between py-2 border-b">
                        <span class="text-muted-foreground">Domains / Subdomains</span>
                        <span>{{ hostingPlan.domains }} / {{ hostingPlan.subdomains }}</span>
                    </div>
                    <div class="flex justify-between py-2 border-b">
                        <span class="text-muted-foreground">Mailpostfächer</span>
                        <span>{{ hostingPlan.mailboxes }}</span>
                    </div>
                    <div class="flex justify-between py-2 border-b">
                        <span class="text-muted-foreground">Datenbanken</span>
                        <span>{{ hostingPlan.databases }}</span>
                    </div>
                    <div class="flex justify-between py-2 border-b">
                        <span class="text-muted-foreground">Preis</span>
                        <span>{{ hostingPlan.price }} €/Monat</span>
                    </div>
                    <div class="flex justify-between py-2 border-b">
                        <span class="text-muted-foreground">Status</span>
                        <Badge :variant="hostingPlan.is_active ? 'success' : 'error'">
                            {{ hostingPlan.is_active ? 'Aktiv' : 'Inaktiv' }}
                        </Badge>
                    </div>
                    <div class="flex justify-between py-2">
                        <span class="text-muted-foreground">Stripe Price ID</span>
                        <code class="text-xs">{{ hostingPlan.stripe_price_id ?? '-' }}</code>
                    </div>
                </CardContent>
            </Card>

            <Card v-if="hostingPlan.webspace_accounts && hostingPlan.webspace_accounts.length > 0">
                <CardHeader>
                    <CardTitle>Letzte Webspace-Accounts</CardTitle>
                    <CardDescription>Kunden mit diesem Paket</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Domain</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead class="text-right">Aktion</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow v-for="acc in hostingPlan.webspace_accounts" :key="acc.id">
                                <TableCell>{{ acc.domain }}</TableCell>
                                <TableCell>
                                    <Badge variant="secondary">{{ acc.status }}</Badge>
                                </TableCell>
                                <TableCell class="text-right">
                                    <Link :href="`/admin/webspace-accounts/${acc.id}`">
                                        <Button variant="ghost" size="sm">Anzeigen</Button>
                                    </Link>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    </AdminLayout>
</template>
