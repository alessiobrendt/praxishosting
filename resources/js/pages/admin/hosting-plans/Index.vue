<!-- Admin: Hosting-Pläne -->
<script setup lang="ts">
import { ref } from 'vue';
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
    BBadge,
    BNav,
    BNavItem,
} from 'bootstrap-vue-next';
import AdminLayout from '@/layouts/AdminLayout.vue';
import Icon from '@/components/wrappers/Icon.vue';
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
    webspace_accounts_count: number;
};

type HostingServer = { id: number; name: string; hostname: string };

type GameserverCloudPlan = {
    id: number;
    name: string;
    price: string;
    is_active: boolean;
    sort_order: number;
    hosting_server: HostingServer | null;
};

type HostingPlanPanel = HostingPlan & {
    hosting_server?: HostingServer | null;
    config?: Record<string, unknown> | null;
    game_server_accounts_count?: number;
};

type Props = {
    hostingPlans: {
        data: HostingPlan[];
        links: { url: string | null; label: string; active: boolean }[];
    };
    hostingPlansPterodactyl: {
        data: HostingPlanPanel[];
        links: { url: string | null; label: string; active: boolean }[];
    };
    hostingPlansTeamSpeak: {
        data: HostingPlanPanel[];
        links: { url: string | null; label: string; active: boolean }[];
    };
    gameserverCloudPlans: {
        data: GameserverCloudPlan[];
        links: { url: string | null; label: string; active: boolean }[];
    };
    brandHasGaming: boolean;
    brandHasTeamSpeak: boolean;
    brandHasGameserverCloud: boolean;
};

const props = withDefaults(defineProps<Props>(), {
    brandHasGaming: false,
    brandHasTeamSpeak: false,
    brandHasGameserverCloud: false,
});

const page = usePage();
const urlTab = (page.url.split('?')[1] || '')
    .split('&')
    .find((p) => p.startsWith('tab='))
    ?.split('=')[1];
const validTabs = ['webspace'];
if (props.brandHasGaming) validTabs.push('pterodactyl');
if (props.brandHasTeamSpeak) validTabs.push('teamspeak');
if (props.brandHasGameserverCloud) validTabs.push('cloud');
const activeTab = ref(
    urlTab && validTabs.includes(urlTab) ? urlTab : 'webspace',
);

function setTab(value: string) {
    activeTab.value = value;
    const url = new URL(window.location.href);
    url.searchParams.set('tab', value);
    router.get(url.pathname + url.search, {}, { preserveState: true });
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Admin', href: '/admin' },
    { title: 'Hosting-Pläne', href: '#' },
];

function paginationUrl(linkUrl: string | null): string {
    if (!linkUrl) return '#';
    const u = new URL(linkUrl, window.location.origin);
    u.searchParams.set('tab', activeTab.value);
    return u.pathname + u.search;
}

const specsShort = (plan: HostingPlan) =>
    `${plan.disk_gb} GB / ${plan.traffic_gb} GB Traffic / ${plan.domains} Dom.`;

function hostingPlanBadgeVariant(active: boolean): 'success' | 'danger' {
    return active ? 'success' : 'danger';
}

function hostingPlanStatusLabel(active: boolean): string {
    return active ? 'Aktiv' : 'Inaktiv';
}

function cloudPlanBadgeVariant(active: boolean): 'success' | 'secondary' {
    return active ? 'success' : 'secondary';
}

function destroyCloudPlan(plan: GameserverCloudPlan) {
    if (!confirm(`Plan „${plan.name}" wirklich löschen?`)) return;
    router.delete(`/admin/gameserver-cloud-plans/${plan.id}`);
}

const webspaceTableFields = [
    { key: 'name', label: 'Name', sortable: false },
    { key: 'plesk_package_name', label: 'Plesk-Paketname', sortable: false },
    { key: 'specs', label: 'Specs', sortable: false },
    { key: 'price', label: 'Preis', sortable: false },
    { key: 'webspace_accounts_count', label: 'Accounts', sortable: false },
    { key: 'status', label: 'Status', sortable: false },
    { key: 'actions', label: 'Aktionen', sortable: false, thClass: 'text-end' },
];

const pterodactylTableFields = [
    { key: 'name', label: 'Name', sortable: false },
    { key: 'server', label: 'Pterodactyl-Server', sortable: false },
    { key: 'price', label: 'Preis', sortable: false },
    { key: 'accounts', label: 'Accounts', sortable: false },
    { key: 'status', label: 'Status', sortable: false },
    { key: 'actions', label: 'Aktionen', sortable: false, thClass: 'text-end' },
];

const teamspeakTableFields = [
    { key: 'name', label: 'Name', sortable: false },
    { key: 'slots', label: 'Slots', sortable: false },
    { key: 'price', label: 'Preis', sortable: false },
    { key: 'accounts', label: 'Accounts', sortable: false },
    { key: 'status', label: 'Status', sortable: false },
    { key: 'actions', label: 'Aktionen', sortable: false, thClass: 'text-end' },
];

const cloudTableFields = [
    { key: 'name', label: 'Name', sortable: false },
    { key: 'price', label: 'Preis', sortable: false },
    { key: 'server', label: 'Pterodactyl-Server', sortable: false },
    { key: 'status', label: 'Status', sortable: false },
    { key: 'actions', label: 'Aktionen', sortable: false, thClass: 'text-end' },
];
</script>

<template>
    <AdminLayout :breadcrumbs="breadcrumbs">
        <Head title="Hosting-Pläne" />

        <BRow>
            <BCol>
                <div class="mb-3">
                    <h4 class="mb-1">Hosting-Pläne</h4>
                    <p class="text-muted small mb-0">
                        Webspace-Pakete (Plesk), Pterodactyl- und TeamSpeak-Pläne sowie Gameserver-Cloud-Pläne
                    </p>
                </div>

                <BNav tabs class="mb-4 flex-wrap">
                    <BNavItem
                        :active="activeTab === 'webspace'"
                        @click="setTab('webspace')"
                    >
                        <Icon icon="server" class="me-1" />
                        Webspace-Pakete
                    </BNavItem>
                    <BNavItem
                        :active="activeTab === 'pterodactyl'"
                        :disabled="!brandHasGaming"
                        @click="brandHasGaming && setTab('pterodactyl')"
                    >
                        <Icon icon="device-gamepad-2" class="me-1" />
                        Game-Server-Pläne
                    </BNavItem>
                    <BNavItem
                        :active="activeTab === 'teamspeak'"
                        :disabled="!brandHasTeamSpeak"
                        @click="brandHasTeamSpeak && setTab('teamspeak')"
                    >
                        <Icon icon="headphones" class="me-1" />
                        TeamSpeak-Pläne
                    </BNavItem>
                    <BNavItem
                        :active="activeTab === 'cloud'"
                        :disabled="!brandHasGameserverCloud"
                        @click="brandHasGameserverCloud && setTab('cloud')"
                    >
                        <Icon icon="cloud" class="me-1" />
                        Gameserver-Cloud-Pläne
                    </BNavItem>
                </BNav>

                <!-- Webspace -->
                <div v-show="activeTab === 'webspace'" class="mb-4">
                    <BCard no-body class="mb-4 border-primary bg-primary bg-opacity-10">
                        <BCardBody class="d-flex flex-wrap align-items-center gap-3 py-4">
                            <div class="flex-shrink-0 rounded bg-primary bg-opacity-25 p-3">
                                <Icon icon="server" class="fs-4 text-primary" />
                            </div>
                            <div class="flex-grow-1 min-w-0">
                                <h5 class="mb-1">Webspace-Pakete</h5>
                                <p class="text-muted small mb-0">
                                    Plesk-Pakete für den Verkauf. Plesk-Paketname = exakter Service-Plan-Name in Plesk.
                                </p>
                            </div>
                            <Link href="/admin/hosting-plans/create">
                                <BButton variant="primary">
                                    <Icon icon="plus" class="me-2" />
                                    Neues Paket
                                </BButton>
                            </Link>
                        </BCardBody>
                    </BCard>
                    <BCard no-body>
                        <BCardHeader>
                            <BCardTitle class="mb-0">Alle Pakete</BCardTitle>
                            <p class="text-muted small mb-0 mt-1">Plesk-Paketname = exakter Service-Plan-Name in Plesk</p>
                        </BCardHeader>
                        <BCardBody class="p-0">
                            <BTable
                                :items="props.hostingPlans.data"
                                :fields="webspaceTableFields"
                                striped
                                responsive
                                class="mb-0"
                                show-empty
                                empty-text="Keine Pakete vorhanden"
                            >
                                <template #cell(name)="row">
                                    <span class="fw-medium">{{ row.item.name }}</span>
                                </template>
                                <template #cell(plesk_package_name)="row">
                                    <code class="small bg-light px-2 py-1 rounded">{{ row.item.plesk_package_name || '–' }}</code>
                                </template>
                                <template #cell(specs)="row">
                                    <span class="small text-muted">{{ specsShort(row.item) }}</span>
                                </template>
                                <template #cell(price)="row">
                                    {{ row.item.price }} €
                                </template>
                                <template #cell(status)="row">
                                    <BBadge :variant="hostingPlanBadgeVariant(row.item.is_active)">
                                        {{ hostingPlanStatusLabel(row.item.is_active) }}
                                    </BBadge>
                                </template>
                                <template #cell(actions)="row">
                                    <Link :href="`/admin/hosting-plans/${row.item.id}`" class="me-1">
                                        <BButton variant="outline-primary" size="sm"><Icon icon="eye" /></BButton>
                                    </Link>
                                    <Link :href="`/admin/hosting-plans/${row.item.id}/edit`">
                                        <BButton variant="outline-secondary" size="sm"><Icon icon="pencil" /></BButton>
                                    </Link>
                                </template>
                            </BTable>
                            <nav
                                v-if="props.hostingPlans.links && props.hostingPlans.links.length > 3"
                                class="d-flex justify-content-center p-3"
                            >
                                <ul class="pagination pagination-sm mb-0">
                                    <li
                                        v-for="(link, idx) in props.hostingPlans.links"
                                        :key="idx"
                                        class="page-item"
                                        :class="{ active: link.active, disabled: !link.url }"
                                    >
                                        <a v-if="link.url" class="page-link" :href="paginationUrl(link.url)" v-html="link.label" />
                                        <span v-else class="page-link" v-html="link.label" />
                                    </li>
                                </ul>
                            </nav>
                        </BCardBody>
                    </BCard>
                </div>

                <!-- Pterodactyl -->
                <div v-show="activeTab === 'pterodactyl'" class="mb-4">
                    <BCard no-body class="mb-4 border-primary bg-primary bg-opacity-10">
                        <BCardBody class="d-flex flex-wrap align-items-center gap-3 py-4">
                            <div class="flex-shrink-0 rounded bg-primary bg-opacity-25 p-3">
                                <Icon icon="device-gamepad-2" class="fs-4 text-primary" />
                            </div>
                            <div class="flex-grow-1 min-w-0">
                                <h5 class="mb-1">Game-Server-Pläne (Pterodactyl)</h5>
                                <p class="text-muted small mb-0">
                                    Pterodactyl-Pläne für Game-Server. Server und Limits in Plan bearbeiten.
                                </p>
                            </div>
                            <Link href="/admin/hosting-plans/create">
                                <BButton variant="primary">
                                    <Icon icon="plus" class="me-2" />
                                    Neuer Plan
                                </BButton>
                            </Link>
                        </BCardBody>
                    </BCard>
                    <BCard no-body>
                        <BCardHeader>
                            <BCardTitle class="mb-0">Alle Game-Server-Pläne</BCardTitle>
                            <p class="text-muted small mb-0 mt-1">Pterodactyl-Server und Konfiguration pro Plan</p>
                        </BCardHeader>
                        <BCardBody class="p-0">
                            <BTable
                                :items="props.hostingPlansPterodactyl.data"
                                :fields="pterodactylTableFields"
                                striped
                                responsive
                                class="mb-0"
                                show-empty
                                empty-text="Keine Game-Server-Pläne vorhanden"
                            >
                                <template #cell(name)="row">
                                    <span class="fw-medium">{{ row.item.name }}</span>
                                </template>
                                <template #cell(server)="row">
                                    <span class="small text-muted">
                                        {{ row.item.hosting_server?.name ?? row.item.hosting_server?.hostname ?? '–' }}
                                    </span>
                                </template>
                                <template #cell(price)="row">
                                    {{ row.item.price }} €
                                </template>
                                <template #cell(accounts)="row">
                                    {{ row.item.game_server_accounts_count ?? 0 }}
                                </template>
                                <template #cell(status)="row">
                                    <BBadge :variant="hostingPlanBadgeVariant(row.item.is_active)">
                                        {{ hostingPlanStatusLabel(row.item.is_active) }}
                                    </BBadge>
                                </template>
                                <template #cell(actions)="row">
                                    <Link :href="`/admin/hosting-plans/${row.item.id}`" class="me-1">
                                        <BButton variant="outline-primary" size="sm"><Icon icon="eye" /></BButton>
                                    </Link>
                                    <Link :href="`/admin/hosting-plans/${row.item.id}/edit`">
                                        <BButton variant="outline-secondary" size="sm"><Icon icon="pencil" /></BButton>
                                    </Link>
                                </template>
                            </BTable>
                            <nav
                                v-if="props.hostingPlansPterodactyl.links && props.hostingPlansPterodactyl.links.length > 3"
                                class="d-flex justify-content-center p-3"
                            >
                                <ul class="pagination pagination-sm mb-0">
                                    <li
                                        v-for="(link, idx) in props.hostingPlansPterodactyl.links"
                                        :key="idx"
                                        class="page-item"
                                        :class="{ active: link.active, disabled: !link.url }"
                                    >
                                        <a v-if="link.url" class="page-link" :href="paginationUrl(link.url)" v-html="link.label" />
                                        <span v-else class="page-link" v-html="link.label" />
                                    </li>
                                </ul>
                            </nav>
                        </BCardBody>
                    </BCard>
                </div>

                <!-- TeamSpeak -->
                <div v-show="activeTab === 'teamspeak'" class="mb-4">
                    <BCard no-body class="mb-4 border-primary bg-primary bg-opacity-10">
                        <BCardBody class="d-flex flex-wrap align-items-center gap-3 py-4">
                            <div class="flex-shrink-0 rounded bg-primary bg-opacity-25 p-3">
                                <Icon icon="headphones" class="fs-4 text-primary" />
                            </div>
                            <div class="flex-grow-1 min-w-0">
                                <h5 class="mb-1">TeamSpeak-Pläne</h5>
                                <p class="text-muted small mb-0">
                                    TeamSpeak-Server-Pläne (Slots etc.). Konfiguration in Plan bearbeiten.
                                </p>
                            </div>
                            <Link href="/admin/hosting-plans/create">
                                <BButton variant="primary">
                                    <Icon icon="plus" class="me-2" />
                                    Neuer Plan
                                </BButton>
                            </Link>
                        </BCardBody>
                    </BCard>
                    <BCard no-body>
                        <BCardHeader>
                            <BCardTitle class="mb-0">Alle TeamSpeak-Pläne</BCardTitle>
                            <p class="text-muted small mb-0 mt-1">Slots und Einstellungen in config</p>
                        </BCardHeader>
                        <BCardBody class="p-0">
                            <BTable
                                :items="props.hostingPlansTeamSpeak.data"
                                :fields="teamspeakTableFields"
                                striped
                                responsive
                                class="mb-0"
                                show-empty
                                empty-text="Keine TeamSpeak-Pläne vorhanden"
                            >
                                <template #cell(name)="row">
                                    <span class="fw-medium">{{ row.item.name }}</span>
                                </template>
                                <template #cell(slots)="row">
                                    <span class="small text-muted">{{ row.item.config?.slots ?? '–' }}</span>
                                </template>
                                <template #cell(price)="row">
                                    {{ row.item.price }} €
                                </template>
                                <template #cell(accounts)="row">
                                    {{ row.item.game_server_accounts_count ?? 0 }}
                                </template>
                                <template #cell(status)="row">
                                    <BBadge :variant="hostingPlanBadgeVariant(row.item.is_active)">
                                        {{ hostingPlanStatusLabel(row.item.is_active) }}
                                    </BBadge>
                                </template>
                                <template #cell(actions)="row">
                                    <Link :href="`/admin/hosting-plans/${row.item.id}`" class="me-1">
                                        <BButton variant="outline-primary" size="sm"><Icon icon="eye" /></BButton>
                                    </Link>
                                    <Link :href="`/admin/hosting-plans/${row.item.id}/edit`">
                                        <BButton variant="outline-secondary" size="sm"><Icon icon="pencil" /></BButton>
                                    </Link>
                                </template>
                            </BTable>
                            <nav
                                v-if="props.hostingPlansTeamSpeak.links && props.hostingPlansTeamSpeak.links.length > 3"
                                class="d-flex justify-content-center p-3"
                            >
                                <ul class="pagination pagination-sm mb-0">
                                    <li
                                        v-for="(link, idx) in props.hostingPlansTeamSpeak.links"
                                        :key="idx"
                                        class="page-item"
                                        :class="{ active: link.active, disabled: !link.url }"
                                    >
                                        <a v-if="link.url" class="page-link" :href="paginationUrl(link.url)" v-html="link.label" />
                                        <span v-else class="page-link" v-html="link.label" />
                                    </li>
                                </ul>
                            </nav>
                        </BCardBody>
                    </BCard>
                </div>

                <!-- Cloud -->
                <div v-show="activeTab === 'cloud'" class="mb-4">
                    <BCard no-body class="mb-4 border-primary bg-primary bg-opacity-10">
                        <BCardBody class="d-flex flex-wrap align-items-center gap-3 py-4">
                            <div class="flex-shrink-0 rounded bg-primary bg-opacity-25 p-3">
                                <Icon icon="cloud" class="fs-4 text-primary" />
                            </div>
                            <div class="flex-grow-1 min-w-0">
                                <h5 class="mb-1">Gameserver-Cloud-Pläne</h5>
                                <p class="text-muted small mb-0">
                                    Cloud-Pläne mit Ressourcen-Pool (CPU, RAM, Disk) für Pterodactyl Game-Server.
                                </p>
                            </div>
                            <Link href="/admin/gameserver-cloud-plans/create">
                                <BButton variant="primary">
                                    <Icon icon="plus" class="me-2" />
                                    Neuer Plan
                                </BButton>
                            </Link>
                        </BCardBody>
                    </BCard>
                    <BCard no-body>
                        <BCardHeader>
                            <BCardTitle class="mb-0">Alle Pläne</BCardTitle>
                            <p class="text-muted small mb-0 mt-1">
                                Pro Brand; Pterodactyl-Server und Limits (max_cpu, max_memory_mb, max_disk_gb) in config.
                            </p>
                        </BCardHeader>
                        <BCardBody class="p-0">
                            <BTable
                                :items="props.gameserverCloudPlans.data"
                                :fields="cloudTableFields"
                                striped
                                responsive
                                class="mb-0"
                                show-empty
                                empty-text="Keine Gameserver-Cloud-Pläne vorhanden"
                            >
                                <template #cell(name)="row">
                                    <span class="fw-medium">{{ row.item.name }}</span>
                                </template>
                                <template #cell(price)="row">
                                    {{ row.item.price }} €
                                </template>
                                <template #cell(server)="row">
                                    <span class="small text-muted">
                                        {{ row.item.hosting_server?.name ?? row.item.hosting_server?.hostname ?? '–' }}
                                    </span>
                                </template>
                                <template #cell(status)="row">
                                    <BBadge :variant="cloudPlanBadgeVariant(row.item.is_active)">
                                        {{ hostingPlanStatusLabel(row.item.is_active) }}
                                    </BBadge>
                                </template>
                                <template #cell(actions)="row">
                                    <Link :href="`/admin/gameserver-cloud-plans/${row.item.id}/edit`" class="me-1">
                                        <BButton variant="outline-primary" size="sm" title="Bearbeiten">
                                            <Icon icon="pencil" />
                                        </BButton>
                                    </Link>
                                    <BButton
                                        variant="outline-danger"
                                        size="sm"
                                        title="Löschen"
                                        @click="destroyCloudPlan(row.item)"
                                    >
                                        <Icon icon="trash" />
                                    </BButton>
                                </template>
                            </BTable>
                            <nav
                                v-if="props.gameserverCloudPlans.links && props.gameserverCloudPlans.links.length > 3"
                                class="d-flex justify-content-center p-3"
                            >
                                <ul class="pagination pagination-sm mb-0">
                                    <li
                                        v-for="(link, idx) in props.gameserverCloudPlans.links"
                                        :key="idx"
                                        class="page-item"
                                        :class="{ active: link.active, disabled: !link.url }"
                                    >
                                        <a v-if="link.url" class="page-link" :href="paginationUrl(link.url)" v-html="link.label" />
                                        <span v-else class="page-link" v-html="link.label" />
                                    </li>
                                </ul>
                            </nav>
                        </BCardBody>
                    </BCard>
                </div>
            </BCol>
        </BRow>
    </AdminLayout>
</template>
