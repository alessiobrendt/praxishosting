<!-- Admin: Subdomains (Cloudflare SRV) -->
<script setup lang="ts">
import { Head, Link, router, usePage } from '@inertiajs/vue3';
import {
    BRow,
    BCol,
    BCard,
    BCardBody,
    BCardHeader,
    BCardTitle,
    BTable,
    BButton,
    BAlert,
} from 'bootstrap-vue-next';
import AdminLayout from '@/layouts/AdminLayout.vue';
import Icon from '@/components/wrappers/Icon.vue';
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

defineProps<Props>();

const page = usePage();
const flash = (page.props.flash as { success?: string; error?: string }) ?? {};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Subdomains', href: '/admin/subdomains' },
];

function confirmDelete(record: SrvRecord): void {
    const msg = record.game_server_account
        ? `Dieser Eintrag ist dem Server „${record.game_server_account.name}" zugeordnet. Wirklich aus Cloudflare löschen?`
        : 'SRV-Eintrag wirklich aus Cloudflare löschen?';
    if (!confirm(msg)) return;
    router.delete(`/admin/subdomains/${record.record_id}`, { preserveScroll: true });
}

const tableFields = [
    { key: 'name', label: 'SRV-Name / Subdomain', sortable: false },
    { key: 'target_port', label: 'Target : Port', sortable: false },
    { key: 'assigned', label: 'Zugewiesen an', sortable: false },
    { key: 'actions', label: 'Aktionen', sortable: false, thClass: 'text-end' },
];
</script>

<template>
    <AdminLayout :breadcrumbs="breadcrumbs">
        <Head title="Subdomains (Cloudflare SRV)" />

        <BRow>
            <BCol>
                <div class="mb-3">
                    <h4 class="mb-1">Subdomains (Cloudflare SRV)</h4>
                    <p class="text-muted small mb-0">
                        SRV-Einträge der konfigurierten Cloudflare-Zone. Zuweisung zu Game-Servern und Löschen leerer
                        Einträge.
                    </p>
                </div>

                <BAlert v-if="flash.success" variant="success" show dismissible class="mb-3">
                    {{ flash.success }}
                </BAlert>
                <BAlert v-if="flash.error" variant="danger" show dismissible class="mb-3">
                    {{ flash.error }}
                </BAlert>

                <BCard v-if="!cloudflareConfigured" no-body>
                    <BCardBody class="py-5 text-center text-muted">
                        Cloudflare ist nicht konfiguriert (CLOUDFLARE_ZONE_ID, CLOUDFLARE_API_TOKEN, CLOUDFLARE_ZONE_DOMAIN
                        in .env).
                    </BCardBody>
                </BCard>

                <BCard v-else no-body>
                    <BCardHeader>
                        <BCardTitle class="mb-0">SRV-Einträge</BCardTitle>
                        <p class="text-muted small mb-0 mt-1">
                            Zone: {{ zoneDomain || '–' }}. Einträge aus der Cloudflare-API; „Nicht zugewiesen" = kein
                            zugeordneter Game-Server in der App.
                        </p>
                    </BCardHeader>
                    <BCardBody class="p-0">
                        <BTable
                            :items="srvRecords"
                            :fields="tableFields"
                            striped
                            responsive
                            class="mb-0"
                            show-empty
                            empty-text="Keine SRV-Einträge gefunden"
                        >
                            <template #cell(name)="row">
                                <code class="bg-light rounded px-2 py-1 small">{{ row.item.name }}</code>
                            </template>
                            <template #cell(target_port)="row">
                                <span v-if="row.item.target || row.item.port">
                                    {{ row.item.target }}:{{ row.item.port }}
                                </span>
                                <span v-else class="text-muted">–</span>
                            </template>
                            <template #cell(assigned)="row">
                                <Link
                                    v-if="row.item.game_server_account"
                                    :href="row.item.game_server_account.url"
                                    class="text-primary text-decoration-none fw-medium"
                                >
                                    {{ row.item.game_server_account.name }}
                                </Link>
                                <span v-else class="text-muted">Nicht zugewiesen</span>
                            </template>
                            <template #cell(actions)="row">
                                <BButton
                                    variant="outline-danger"
                                    size="sm"
                                    @click="confirmDelete(row.item)"
                                >
                                    <Icon icon="trash" class="me-1" />
                                    Löschen
                                </BButton>
                            </template>
                        </BTable>
                    </BCardBody>
                </BCard>
            </BCol>
        </BRow>
    </AdminLayout>
</template>
