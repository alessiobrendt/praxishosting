<script setup lang="ts">
import { Head, Link, router, usePage } from '@inertiajs/vue3';
import { Trash2 } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
} from '@/components/ui/table';
import { Heading, Text } from '@/components/ui/typography';
import AdminLayout from '@/layouts/AdminLayout.vue';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';

type GameServerAccountRef = {
    id: number;
    name: string;
    url: string;
};

type SrvRecord = {
    record_id: string;
    name: string;
    target: string;
    port: number;
    game_server_account: GameServerAccountRef | null;
};

type Props = {
    srvRecords: SrvRecord[];
    zoneDomain: string;
    cloudflareConfigured: boolean;
};

const props = defineProps<Props>();

const page = usePage();
const flash = (page.props.flash as { success?: string; error?: string }) ?? {};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Subdomains', href: '/admin/subdomains' },
];

function confirmDelete(record: SrvRecord) {
    const msg = record.game_server_account
        ? `Dieser Eintrag ist dem Server „${record.game_server_account.name}" zugeordnet. Wirklich aus Cloudflare löschen?`
        : 'SRV-Eintrag wirklich aus Cloudflare löschen?';
    if (!confirm(msg)) return;
    router.delete(`/admin/subdomains/${record.record_id}`, { preserveScroll: true });
}
</script>

<template>
    <AdminLayout :breadcrumbs="breadcrumbs">
        <Head title="Subdomains (Cloudflare SRV)" />

        <div class="space-y-6">
            <div>
                <Heading level="h1">Subdomains (Cloudflare SRV)</Heading>
                <Text class="mt-2" muted>
                    SRV-Einträge der konfigurierten Cloudflare-Zone. Zuweisung zu Game-Servern und Löschen leerer
                    Einträge.
                </Text>
            </div>

            <div
                v-if="flash.success"
                class="rounded-md border border-green-500/50 bg-green-500/10 px-3 py-2 text-sm text-green-700 dark:text-green-400"
            >
                {{ flash.success }}
            </div>
            <div
                v-if="flash.error"
                class="rounded-md border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive"
            >
                {{ flash.error }}
            </div>

            <Card v-if="!cloudflareConfigured">
                <CardContent class="py-8 text-center text-muted-foreground">
                    Cloudflare ist nicht konfiguriert (CLOUDFLARE_ZONE_ID, CLOUDFLARE_API_TOKEN, CLOUDFLARE_ZONE_DOMAIN
                    in .env).
                </CardContent>
            </Card>

            <Card v-else>
                <CardHeader>
                    <CardTitle>SRV-Einträge</CardTitle>
                    <CardDescription>
                        Zone: {{ zoneDomain || '–' }}. Einträge aus der Cloudflare-API; „Nicht zugewiesen" = kein
                        zugeordneter Game-Server in der App.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>SRV-Name / Subdomain</TableHead>
                                <TableHead>Target : Port</TableHead>
                                <TableHead>Zugewiesen an</TableHead>
                                <TableHead class="text-right">Aktionen</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow
                                v-for="record in props.srvRecords"
                                :key="record.record_id"
                            >
                                <TableCell>
                                    <code class="rounded bg-muted px-2 py-1 text-sm">{{ record.name }}</code>
                                </TableCell>
                                <TableCell>
                                    <span v-if="record.target || record.port">
                                        {{ record.target }}:{{ record.port }}
                                    </span>
                                    <span v-else class="text-muted-foreground">–</span>
                                </TableCell>
                                <TableCell>
                                    <Link
                                        v-if="record.game_server_account"
                                        :href="record.game_server_account.url"
                                        class="font-medium text-primary hover:underline"
                                    >
                                        {{ record.game_server_account.name }}
                                    </Link>
                                    <span v-else class="text-muted-foreground">Nicht zugewiesen</span>
                                </TableCell>
                                <TableCell class="text-right">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        class="text-destructive hover:text-destructive"
                                        @click="confirmDelete(record)"
                                    >
                                        <Trash2 class="h-4 w-4" />
                                        Löschen
                                    </Button>
                                </TableCell>
                            </TableRow>
                            <TableRow v-if="cloudflareConfigured && props.srvRecords.length === 0">
                                <TableCell
                                    colspan="4"
                                    class="text-center text-muted-foreground"
                                >
                                    Keine SRV-Einträge gefunden.
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    </AdminLayout>
</template>
