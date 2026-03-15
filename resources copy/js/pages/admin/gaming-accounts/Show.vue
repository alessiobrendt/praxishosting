<script setup lang="ts">
import { computed } from 'vue';
import { Form, Head, Link, usePage } from '@inertiajs/vue3';
import { CreditCard, ExternalLink, Server } from 'lucide-vue-next';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Heading, Text } from '@/components/ui/typography';
import AdminLayout from '@/layouts/AdminLayout.vue';
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

        <div class="space-y-6">
            <div class="flex flex-wrap items-center justify-between gap-4">
                <div class="flex items-center gap-2">
                    <Server class="h-8 w-8" />
                    <div>
                        <Heading level="h1">{{ gameServerAccount.name }}</Heading>
                        <Text class="mt-2" muted>
                            Pterodactyl-Game-Server – Kunde: {{ gameServerAccount.user.name }}
                        </Text>
                    </div>
                </div>
                <div class="flex items-center gap-2">
                    <Badge variant="secondary">{{ gameServerAccount.status }}</Badge>
                    <Form
                        v-if="gameServerAccount.status === 'pending'"
                        :action="`/admin/gaming-accounts/${gameServerAccount.id}/retry-provisioning`"
                        method="post"
                        class="inline"
                        v-slot="{ processing }"
                    >
                        <input type="hidden" name="_token" :value="csrfToken()" />
                        <Button type="submit" variant="default" :disabled="processing">
                            {{ processing ? 'Wird ausgeführt…' : 'Installation neu anstoßen' }}
                        </Button>
                    </Form>
                    <Link :href="`/admin/gaming-accounts/${gameServerAccount.id}/edit`">
                        <Button variant="outline">Bearbeiten</Button>
                    </Link>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Zugang</CardTitle>
                    <CardDescription>Kunde kann sich damit im Pterodactyl-Panel anmelden</CardDescription>
                </CardHeader>
                <CardContent class="space-y-4">
                    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <Text class="text-sm font-medium text-muted-foreground">Kunde</Text>
                            <p class="font-medium">{{ gameServerAccount.user.name }}</p>
                            <p class="text-sm text-muted-foreground">{{ gameServerAccount.user.email }}</p>
                        </div>
                        <div>
                            <Text class="text-sm font-medium text-muted-foreground">Server-Name</Text>
                            <p class="font-medium">{{ gameServerAccount.name }}</p>
                        </div>
                        <div>
                            <Text class="text-sm font-medium text-muted-foreground">Identifier</Text>
                            <code v-if="gameServerAccount.identifier" class="rounded bg-muted px-2 py-1 text-sm">{{ gameServerAccount.identifier }}</code>
                            <span v-else class="text-muted-foreground">–</span>
                        </div>
                        <div>
                            <Text class="text-sm font-medium text-muted-foreground">Plan / Server</Text>
                            <p class="font-medium">{{ planLabel }}</p>
                            <p class="text-sm text-muted-foreground">{{ gameServerAccount.hosting_server?.name ?? gameServerAccount.hosting_server?.hostname ?? '–' }}</p>
                        </div>
                        <div>
                            <Text class="text-sm font-medium text-muted-foreground">Abo-Ende</Text>
                            <p class="font-medium">{{ formatDate(periodEndDate) }}</p>
                        </div>
                        <div v-if="!isCloudAccount">
                            <Text class="text-sm font-medium text-muted-foreground">Verlängerung</Text>
                            <p class="font-medium">{{ renewalLabel }}</p>
                        </div>
                        <div v-else>
                            <Text class="text-sm font-medium text-muted-foreground">Typ</Text>
                            <p class="font-medium">Gameserver Cloud (Abo-Verwaltung beim Kunden)</p>
                        </div>
                        <div v-if="gameServerAccount.monthly_amount != null">
                            <Text class="text-sm font-medium text-muted-foreground">Monatspreis</Text>
                            <p class="font-medium">{{ gameServerAccount.monthly_amount?.toFixed(2) }} €</p>
                        </div>
                    </div>
                    <div v-if="Object.keys(gameServerAccount.option_values ?? {}).length" class="pt-2">
                        <Text class="text-sm font-medium text-muted-foreground">Optionen (RAM, Disk, …)</Text>
                        <pre class="mt-1 rounded bg-muted p-2 text-xs">{{ JSON.stringify(gameServerAccount.option_values, null, 2) }}</pre>
                    </div>
                    <div class="flex flex-wrap gap-2 pt-4">
                        <Link v-if="loginUrl" :href="loginUrl" target="_blank" rel="noopener noreferrer">
                            <Button variant="outline" as="span">
                                <ExternalLink class="mr-2 h-4 w-4" />
                                Im Pterodactyl-Panel öffnen
                            </Button>
                        </Link>
                        <Link :href="`/admin/gaming-accounts/${gameServerAccount.id}/edit`">
                            <Button variant="default">Bearbeiten (Upgrades)</Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>

            <Card v-if="!isCloudAccount && gameServerAccount.mollie_subscription_id">
                <CardHeader>
                    <CardTitle class="flex items-center gap-2">
                        <CreditCard class="h-5 w-5" />
                        Mollie-Abo
                    </CardTitle>
                    <CardDescription>Subscription bei Mollie – Abo kündigen zum Periodenende</CardDescription>
                </CardHeader>
                <CardContent class="space-y-3">
                    <div>
                        <Text class="text-sm font-medium text-muted-foreground">Subscription-ID</Text>
                        <p class="font-mono text-sm">{{ gameServerAccount.mollie_subscription_id }}</p>
                    </div>
                    <div v-if="gameServerAccount.cancel_at_period_end" class="text-amber-600 dark:text-amber-400 text-sm">
                        Wird zum Periodenende gekündigt.
                    </div>
                    <div class="flex flex-wrap gap-2">
                        <a
                            href="https://www.mollie.com/dashboard/customers"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="inline-flex"
                        >
                            <Button variant="outline" size="sm" as="span">
                                <ExternalLink class="mr-2 h-4 w-4" />
                                Bei Mollie anzeigen
                            </Button>
                        </a>
                        <Form
                            v-if="!gameServerAccount.cancel_at_period_end"
                            :action="`/admin/gaming-accounts/${gameServerAccount.id}/subscription/cancel`"
                            method="post"
                            class="inline"
                        >
                            <input type="hidden" name="_token" :value="csrfToken()" />
                            <Button type="submit" variant="outline" size="sm">
                                Abo kündigen
                            </Button>
                        </Form>
                    </div>
                </CardContent>
            </Card>

            <div class="flex flex-wrap gap-2">
                <Link href="/admin/gaming-accounts">
                    <Button variant="outline">Game-Server-Accounts</Button>
                </Link>
                <Link v-if="isCloudAccount" href="/admin/gameserver-cloud-accounts">
                    <Button variant="outline">Gameserver-Cloud-Accounts</Button>
                </Link>
            </div>
        </div>
    </AdminLayout>
</template>
