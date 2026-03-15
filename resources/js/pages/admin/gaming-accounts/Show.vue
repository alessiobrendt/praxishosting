<!-- Admin: Game-Server-Account (Detail) -->
<script setup lang="ts">
import { computed } from 'vue';
import { Form, Head, Link, usePage } from '@inertiajs/vue3';
import {
    BRow,
    BCol,
    BCard,
    BCardHeader,
    BCardTitle,
    BCardBody,
    BButton,
    BBadge,
} from 'bootstrap-vue-next';
import AdminLayout from '@/layouts/AdminLayout.vue';
import Icon from '@/components/wrappers/Icon.vue';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';

type User = { id: number; name: string; email: string };
type HostingPlan = { id: number; name: string };
type HostingServer = { id: number; name: string | null; hostname: string } | null;
type GameserverCloudSubscription = {
    id: number;
    current_period_ends_at: string | null;
    gameserver_cloud_plan: { id: number; name: string };
};

type GameServerAccount = {
    id: number;
    uuid: string;
    name: string;
    identifier: string | null;
    status: string;
    current_period_ends_at: string | null;
    mollie_subscription_id?: string | null;
    cancel_at_period_end?: boolean;
    renewal_type?: string | null;
    option_values?: Record<string, unknown> | null;
    monthly_amount?: number;
    user: User;
    hosting_plan?: HostingPlan | null;
    hosting_server: HostingServer;
    gameserver_cloud_subscription?: GameserverCloudSubscription | null;
};

type Props = {
    gameServerAccount: GameServerAccount;
    loginUrl: string | null;
};

const props = defineProps<Props>();

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Game-Server-Accounts', href: '/admin/gaming-accounts' },
    { title: props.gameServerAccount.name, href: '#' },
];

const formatDate = (d: string | null) =>
    d ? new Date(d).toLocaleDateString('de-DE', { timeZone: 'UTC' }) : '–';

const isCloudAccount = computed(
    () => !!props.gameServerAccount.gameserver_cloud_subscription,
);
const planLabel = computed(
    () =>
        props.gameServerAccount.hosting_plan?.name ??
        props.gameServerAccount.gameserver_cloud_subscription?.gameserver_cloud_plan?.name ??
        '–',
);
const periodEndDate = computed(
    () =>
        props.gameServerAccount.gameserver_cloud_subscription?.current_period_ends_at ??
        props.gameServerAccount.current_period_ends_at,
);
const renewalLabel = props.gameServerAccount.renewal_type === 'auto' ? 'Auto (Mollie-Abo)' : 'Manuell';
const page = usePage();
const csrfToken = () => (page.props.csrfToken as string) ?? '';
</script>

<template>
    <AdminLayout :breadcrumbs="breadcrumbs">
        <Head :title="`Game-Server: ${gameServerAccount.name}`" />

        <BRow>
            <BCol>
                <div class="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
                    <div>
                        <h4 class="mb-1">{{ gameServerAccount.name }}</h4>
                        <p class="text-muted small mb-0">
                            Pterodactyl-Game-Server – Kunde: {{ gameServerAccount.user.name }}
                        </p>
                    </div>
                    <div class="d-flex flex-wrap gap-2 align-items-center">
                        <BBadge variant="secondary">{{ gameServerAccount.status }}</BBadge>
                        <Form
                            v-if="gameServerAccount.status === 'pending'"
                            :action="`/admin/gaming-accounts/${gameServerAccount.uuid}/retry-provisioning`"
                            method="post"
                            class="d-inline"
                            v-slot="{ processing }"
                        >
                            <input type="hidden" name="_token" :value="csrfToken()" />
                            <BButton type="submit" variant="primary" :disabled="processing">
                                {{ processing ? 'Wird ausgeführt…' : 'Installation neu anstoßen' }}
                            </BButton>
                        </Form>
                        <Link :href="`/admin/gaming-accounts/${gameServerAccount.uuid}/edit`">
                            <BButton variant="outline-primary">Bearbeiten</BButton>
                        </Link>
                    </div>
                </div>

                <BCard no-body class="mb-4">
                    <BCardHeader>
                        <BCardTitle class="mb-0">Zugang</BCardTitle>
                        <p class="text-muted small mb-0 mt-1">Kunde kann sich damit im Pterodactyl-Panel anmelden</p>
                    </BCardHeader>
                    <BCardBody>
                        <BRow>
                            <BCol sm="6" class="mb-3">
                                <p class="text-muted small mb-1">Kunde</p>
                                <p class="fw-medium mb-0">{{ gameServerAccount.user.name }}</p>
                                <p class="small text-muted mb-0">{{ gameServerAccount.user.email }}</p>
                            </BCol>
                            <BCol sm="6" class="mb-3">
                                <p class="text-muted small mb-1">Server-Name</p>
                                <p class="fw-medium mb-0">{{ gameServerAccount.name }}</p>
                            </BCol>
                            <BCol sm="6" class="mb-3">
                                <p class="text-muted small mb-1">Identifier</p>
                                <code
                                    v-if="gameServerAccount.identifier"
                                    class="small bg-light px-2 py-1 rounded"
                                >
                                    {{ gameServerAccount.identifier }}
                                </code>
                                <span v-else class="text-muted">–</span>
                            </BCol>
                            <BCol sm="6" class="mb-3">
                                <p class="text-muted small mb-1">Plan / Server</p>
                                <p class="fw-medium mb-0">{{ planLabel }}</p>
                                <p class="small text-muted mb-0">
                                    {{ gameServerAccount.hosting_server?.name ?? gameServerAccount.hosting_server?.hostname ?? '–' }}
                                </p>
                            </BCol>
                            <BCol sm="6" class="mb-3">
                                <p class="text-muted small mb-1">Abo-Ende</p>
                                <p class="fw-medium mb-0">{{ formatDate(periodEndDate) }}</p>
                            </BCol>
                            <BCol v-if="!isCloudAccount" sm="6" class="mb-3">
                                <p class="text-muted small mb-1">Verlängerung</p>
                                <p class="fw-medium mb-0">{{ renewalLabel }}</p>
                            </BCol>
                            <BCol v-else sm="6" class="mb-3">
                                <p class="text-muted small mb-1">Typ</p>
                                <p class="fw-medium mb-0">Gameserver Cloud (Abo-Verwaltung beim Kunden)</p>
                            </BCol>
                            <BCol v-if="gameServerAccount.monthly_amount != null" sm="6" class="mb-3">
                                <p class="text-muted small mb-1">Monatspreis</p>
                                <p class="fw-medium mb-0">{{ gameServerAccount.monthly_amount?.toFixed(2) }} €</p>
                            </BCol>
                        </BRow>
                        <div v-if="Object.keys(gameServerAccount.option_values ?? {}).length" class="pt-2">
                            <p class="text-muted small mb-1">Optionen (RAM, Disk, …)</p>
                            <pre class="rounded bg-light p-2 small mb-0">{{ JSON.stringify(gameServerAccount.option_values, null, 2) }}</pre>
                        </div>
                        <div class="d-flex flex-wrap gap-2 pt-3">
                            <Link v-if="loginUrl" :href="loginUrl" target="_blank" rel="noopener noreferrer">
                                <BButton variant="outline-primary" size="sm">
                                    <Icon icon="external-link" class="me-1" />
                                    Im Pterodactyl-Panel öffnen
                                </BButton>
                            </Link>
                            <Link :href="`/admin/gaming-accounts/${gameServerAccount.uuid}/edit`">
                                <BButton variant="primary" size="sm">Bearbeiten (Upgrades)</BButton>
                            </Link>
                        </div>
                    </BCardBody>
                </BCard>

                <BCard v-if="!isCloudAccount && gameServerAccount.mollie_subscription_id" no-body class="mb-4">
                    <BCardHeader>
                        <BCardTitle class="mb-0 d-flex align-items-center gap-2">
                            <Icon icon="credit-card" />
                            Mollie-Abo
                        </BCardTitle>
                        <p class="text-muted small mb-0 mt-1">
                            Subscription bei Mollie – Abo kündigen zum Periodenende
                        </p>
                    </BCardHeader>
                    <BCardBody>
                        <div class="mb-3">
                            <p class="text-muted small mb-1">Subscription-ID</p>
                            <p class="font-monospace small mb-0">{{ gameServerAccount.mollie_subscription_id }}</p>
                        </div>
                        <div
                            v-if="gameServerAccount.cancel_at_period_end"
                            class="small text-warning mb-3"
                        >
                            Wird zum Periodenende gekündigt.
                        </div>
                        <div class="d-flex flex-wrap gap-2">
                            <a
                                href="https://www.mollie.com/dashboard/customers"
                                target="_blank"
                                rel="noopener noreferrer"
                                class="text-decoration-none"
                            >
                                <BButton variant="outline-secondary" size="sm">
                                    <Icon icon="external-link" class="me-1" />
                                    Bei Mollie anzeigen
                                </BButton>
                            </a>
                            <Form
                                v-if="!gameServerAccount.cancel_at_period_end"
                                :action="`/admin/gaming-accounts/${gameServerAccount.uuid}/subscription/cancel`"
                                method="post"
                                class="d-inline"
                            >
                                <input type="hidden" name="_token" :value="csrfToken()" />
                                <BButton type="submit" variant="outline-secondary" size="sm">
                                    Abo kündigen
                                </BButton>
                            </Form>
                        </div>
                    </BCardBody>
                </BCard>

                <div class="d-flex flex-wrap gap-2">
                    <Link href="/admin/gaming-accounts">
                        <BButton variant="outline-secondary">Game-Server-Accounts</BButton>
                    </Link>
                    <Link v-if="isCloudAccount" href="/admin/gameserver-cloud-accounts">
                        <BButton variant="outline-secondary">Gameserver-Cloud-Accounts</BButton>
                    </Link>
                </div>
            </BCol>
        </BRow>
    </AdminLayout>
</template>
