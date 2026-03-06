<script setup lang="ts">
import { Form, Head, Link, usePage } from '@inertiajs/vue3';
import { CreditCard, ExternalLink, Headphones } from 'lucide-vue-next';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Heading, Text } from '@/components/ui/typography';
import AdminLayout from '@/layouts/AdminLayout.vue';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';

type User = { id: number; name: string; email: string };
type HostingPlan = { id: number; name: string; config?: { plan_options?: unknown[] } };
type HostingServer = { id: number; name: string | null; hostname: string } | null;

type TeamSpeakServerAccount = {
    id: number;
    name: string;
    port: number | null;
    virtual_server_id: number | null;
    status: string;
    current_period_ends_at: string | null;
    option_values?: Record<string, unknown> | null;
    mollie_subscription_id?: string | null;
    cancel_at_period_end?: boolean;
    renewal_type?: string | null;
    monthly_amount?: number;
    user: User;
    hosting_plan: HostingPlan;
    hosting_server: HostingServer;
};

type Props = {
    teamSpeakServerAccount: TeamSpeakServerAccount;
};

const props = defineProps<Props>();

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'TeamSpeak-Server-Accounts', href: '/admin/teamspeak-accounts' },
    { title: props.teamSpeakServerAccount.name, href: '#' },
];

const formatDate = (d: string | null) =>
    d ? new Date(d).toLocaleDateString('de-DE', { timeZone: 'UTC' }) : '–';

const slots = (props.teamSpeakServerAccount.option_values?.slots as number) ?? null;
const renewalLabel = props.teamSpeakServerAccount.renewal_type === 'auto' ? 'Auto (Mollie-Abo)' : 'Manuell';
const page = usePage();
const csrfToken = () => (page.props.csrfToken as string) ?? '';
</script>

<template>
    <AdminLayout :breadcrumbs="breadcrumbs">
        <Head :title="`TeamSpeak: ${teamSpeakServerAccount.name}`" />

        <div class="space-y-6">
            <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                    <Headphones class="h-8 w-8" />
                    <div>
                        <Heading level="h1">{{ teamSpeakServerAccount.name }}</Heading>
                        <Text class="mt-2" muted>
                            TeamSpeak-Server – Kunde: {{ teamSpeakServerAccount.user.name }}
                        </Text>
                    </div>
                </div>
                <Badge variant="secondary">{{ teamSpeakServerAccount.status }}</Badge>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Account-Daten</CardTitle>
                    <CardDescription>Kunde und Zuordnung</CardDescription>
                </CardHeader>
                <CardContent class="space-y-4">
                    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <Text class="text-sm font-medium text-muted-foreground">Kunde</Text>
                            <p class="font-medium">{{ teamSpeakServerAccount.user.name }}</p>
                            <p class="text-sm text-muted-foreground">{{ teamSpeakServerAccount.user.email }}</p>
                        </div>
                        <div>
                            <Text class="text-sm font-medium text-muted-foreground">Server-Name</Text>
                            <p class="font-medium">{{ teamSpeakServerAccount.name }}</p>
                        </div>
                        <div>
                            <Text class="text-sm font-medium text-muted-foreground">Port / Virtual Server ID</Text>
                            <p class="font-medium">
                                <span v-if="teamSpeakServerAccount.port != null">{{ teamSpeakServerAccount.port }}</span>
                                <span v-else class="text-muted-foreground">–</span>
                                <span v-if="teamSpeakServerAccount.virtual_server_id != null" class="text-muted-foreground">
                                    (ID: {{ teamSpeakServerAccount.virtual_server_id }})
                                </span>
                            </p>
                        </div>
                        <div>
                            <Text class="text-sm font-medium text-muted-foreground">Plan / Hosting-Server</Text>
                            <p class="font-medium">{{ teamSpeakServerAccount.hosting_plan.name }}</p>
                            <p class="text-sm text-muted-foreground">{{ teamSpeakServerAccount.hosting_server?.name ?? teamSpeakServerAccount.hosting_server?.hostname ?? '–' }}</p>
                        </div>
                        <div>
                            <Text class="text-sm font-medium text-muted-foreground">Abo-Ende</Text>
                            <p class="font-medium">{{ formatDate(teamSpeakServerAccount.current_period_ends_at) }}</p>
                        </div>
                        <div v-if="slots != null">
                            <Text class="text-sm font-medium text-muted-foreground">Slots</Text>
                            <p class="font-medium">{{ slots }}</p>
                        </div>
                        <div>
                            <Text class="text-sm font-medium text-muted-foreground">Verlängerung</Text>
                            <p class="font-medium">{{ renewalLabel }}</p>
                        </div>
                        <div v-if="teamSpeakServerAccount.monthly_amount != null">
                            <Text class="text-sm font-medium text-muted-foreground">Monatspreis</Text>
                            <p class="font-medium">{{ teamSpeakServerAccount.monthly_amount?.toFixed(2) }} €</p>
                        </div>
                    </div>
                    <div class="flex flex-wrap gap-2 pt-4">
                        <Link :href="`/admin/teamspeak-accounts/${teamSpeakServerAccount.id}/edit`">
                            <Button variant="default">Bearbeiten</Button>
                        </Link>
                        <a :href="`/teamspeak-accounts/${teamSpeakServerAccount.id}`" target="_blank" rel="noopener noreferrer">
                            <Button variant="outline" as="span">
                                <ExternalLink class="mr-2 h-4 w-4" />
                                Als Kunde ansehen
                            </Button>
                        </a>
                    </div>
                </CardContent>
            </Card>

            <Card v-if="teamSpeakServerAccount.mollie_subscription_id">
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
                        <p class="font-mono text-sm">{{ teamSpeakServerAccount.mollie_subscription_id }}</p>
                    </div>
                    <div v-if="teamSpeakServerAccount.cancel_at_period_end" class="text-amber-600 dark:text-amber-400 text-sm">
                        Wird zum Periodenende gekündigt.
                    </div>
                    <div class="flex flex-wrap gap-2">
                        <a
                            :href="`https://www.mollie.com/dashboard/customers`"
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
                            v-if="!teamSpeakServerAccount.cancel_at_period_end"
                            :action="`/admin/teamspeak-accounts/${teamSpeakServerAccount.id}/subscription/cancel`"
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
        </div>
    </AdminLayout>
</template>
