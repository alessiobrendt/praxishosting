<script setup lang="ts">
import { Form, Head, Link, usePage } from '@inertiajs/vue3';
import { watch } from 'vue';
import { CreditCard, ExternalLink, HardDrive } from 'lucide-vue-next';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Heading, Text } from '@/components/ui/typography';
import { notify } from '@/composables/useNotify';
import AdminLayout from '@/layouts/AdminLayout.vue';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';

type WebspaceAccount = {
    id: number;
    domain: string;
    plesk_username: string;
    status: string;
    mollie_subscription_id: string | null;
    current_period_ends_at: string | null;
    cancel_at_period_end: boolean;
    ends_at: string | null;
    user: { id: number; name: string; email: string };
    hosting_plan: { id: number; name: string };
    hosting_server: { id: number; hostname: string } | null;
};

type Props = {
    webspaceAccount: WebspaceAccount;
};

const props = defineProps<Props>();

const page = usePage();
const csrfToken = () => (page.props.csrfToken as string) ?? '';

watch(
    () => (page.props.flash as { error?: string; success?: string; warning?: string })?.error,
    (message) => {
        if (message) notify.error(message);
    },
    { immediate: true },
);
watch(
    () => (page.props.flash as { error?: string; success?: string })?.success,
    (message) => {
        if (message) notify.success(message);
    },
    { immediate: true },
);

const canRetryPlesk = () =>
    props.webspaceAccount.status === 'pending' || props.webspaceAccount.status === 'active';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Webspace-Accounts', href: '/admin/webspace-accounts' },
    { title: props.webspaceAccount.domain, href: '#' },
];

const formatDate = (d: string | null) =>
    d ? new Date(d).toLocaleDateString('de-DE', { timeZone: 'UTC' }) : '–';
</script>

<template>
    <AdminLayout :breadcrumbs="breadcrumbs">
        <Head :title="webspaceAccount.domain" />

        <div class="space-y-6">
            <div class="flex flex-wrap items-center justify-between gap-4">
                <div class="flex items-center gap-2">
                    <HardDrive class="h-8 w-8" />
                    <div>
                        <Heading level="h1">{{ webspaceAccount.domain }}</Heading>
                        <Text class="mt-2" muted>
                            Webspace-Account · {{ webspaceAccount.hosting_plan.name }}
                        </Text>
                    </div>
                </div>
                <div v-if="canRetryPlesk()" class="flex items-center gap-2">
                    <Form
                        :action="`/admin/webspace-accounts/${webspaceAccount.id}/retry-plesk`"
                        method="post"
                        class="inline"
                    >
                        <input type="hidden" name="_token" :value="csrfToken()" />
                        <Button type="submit" variant="outline">
                            Plesk-Anlage erneut ausführen
                        </Button>
                    </Form>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Details</CardTitle>
                    <CardDescription>Kunde, Domain, Plan, Server, Status, Abo-Ende</CardDescription>
                </CardHeader>
                <CardContent>
                    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <Text class="text-sm font-medium text-muted-foreground">Kunde</Text>
                            <p class="font-medium">{{ webspaceAccount.user.name }}</p>
                            <p class="text-sm text-muted-foreground">{{ webspaceAccount.user.email }}</p>
                        </div>
                        <div>
                            <Text class="text-sm font-medium text-muted-foreground">Domain</Text>
                            <code class="rounded bg-muted px-2 py-1 text-sm">{{ webspaceAccount.domain }}</code>
                        </div>
                        <div>
                            <Text class="text-sm font-medium text-muted-foreground">Plesk-Benutzer</Text>
                            <p class="font-mono text-sm">{{ webspaceAccount.plesk_username }}</p>
                        </div>
                        <div>
                            <Text class="text-sm font-medium text-muted-foreground">Plan</Text>
                            <Link :href="`/admin/hosting-plans/${webspaceAccount.hosting_plan.id}`" class="text-primary hover:underline font-medium">
                                {{ webspaceAccount.hosting_plan.name }}
                            </Link>
                        </div>
                        <div>
                            <Text class="text-sm font-medium text-muted-foreground">Server</Text>
                            <p class="font-medium">{{ webspaceAccount.hosting_server?.hostname ?? '–' }}</p>
                        </div>
                        <div>
                            <Text class="text-sm font-medium text-muted-foreground">Status</Text>
                            <p><Badge variant="secondary">{{ webspaceAccount.status }}</Badge></p>
                        </div>
                        <div>
                            <Text class="text-sm font-medium text-muted-foreground">Abo-Ende (aktueller Zeitraum)</Text>
                            <p class="font-medium">{{ formatDate(webspaceAccount.current_period_ends_at) }}</p>
                        </div>
                        <div>
                            <Text class="text-sm font-medium text-muted-foreground">Kündigung zum Periodenende</Text>
                            <p class="font-medium">{{ webspaceAccount.cancel_at_period_end ? 'Ja' : 'Nein' }}</p>
                        </div>
                        <div>
                            <Text class="text-sm font-medium text-muted-foreground">Beendet am</Text>
                            <p class="font-medium">{{ formatDate(webspaceAccount.ends_at) }}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card v-if="webspaceAccount.mollie_subscription_id">
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
                        <p class="font-mono text-sm">{{ webspaceAccount.mollie_subscription_id }}</p>
                    </div>
                    <div v-if="webspaceAccount.cancel_at_period_end" class="text-amber-600 dark:text-amber-400 text-sm">
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
                            v-if="!webspaceAccount.cancel_at_period_end"
                            :action="`/admin/webspace-accounts/${webspaceAccount.id}/subscription/cancel`"
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

            <div class="flex gap-2">
                <Link href="/admin/webspace-accounts">
                    <Button variant="outline">Zurück zur Liste</Button>
                </Link>
            </div>
        </div>
    </AdminLayout>
</template>
