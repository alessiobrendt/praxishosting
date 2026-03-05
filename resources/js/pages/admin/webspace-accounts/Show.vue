<script setup lang="ts">
import { Form, Head, Link, usePage } from '@inertiajs/vue3';
import { watch } from 'vue';
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
    stripe_subscription_id: string | null;
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
watch(
    () => (page.props.flash as { error?: string; success?: string })?.error,
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

const stripeDashboardUrl = (subId: string | null) =>
    subId ? `https://dashboard.stripe.com/subscriptions/${subId}` : null;
</script>

<template>
    <AdminLayout :breadcrumbs="breadcrumbs">
        <Head :title="webspaceAccount.domain" />

        <div class="space-y-6">
            <div class="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <Heading level="h1">{{ webspaceAccount.domain }}</Heading>
                    <Text class="mt-2" muted>
                        Webspace-Account · {{ webspaceAccount.hosting_plan.name }}
                    </Text>
                </div>
                <div v-if="canRetryPlesk()">
                    <Form
                        :action="`/admin/webspace-accounts/${webspaceAccount.id}/retry-plesk`"
                        method="post"
                        class="inline"
                    >
                        <Button type="submit" variant="outline">
                            Plesk-Anlage erneut ausführen
                        </Button>
                    </Form>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Details</CardTitle>
                    <CardDescription>Kunde, Plan, Server, Abo</CardDescription>
                </CardHeader>
                <CardContent class="space-y-2">
                    <div class="flex justify-between py-2 border-b">
                        <span class="text-muted-foreground">Kunde</span>
                        <span>{{ webspaceAccount.user.name }} ({{ webspaceAccount.user.email }})</span>
                    </div>
                    <div class="flex justify-between py-2 border-b">
                        <span class="text-muted-foreground">Domain</span>
                        <code class="rounded bg-gray-100 px-2 py-1 text-sm dark:bg-gray-800">{{ webspaceAccount.domain }}</code>
                    </div>
                    <div class="flex justify-between py-2 border-b">
                        <span class="text-muted-foreground">Plesk-Benutzer</span>
                        <code class="text-sm">{{ webspaceAccount.plesk_username }}</code>
                    </div>
                    <div class="flex justify-between py-2 border-b">
                        <span class="text-muted-foreground">Plan</span>
                        <Link :href="`/admin/hosting-plans/${webspaceAccount.hosting_plan.id}`" class="text-primary hover:underline">
                            {{ webspaceAccount.hosting_plan.name }}
                        </Link>
                    </div>
                    <div class="flex justify-between py-2 border-b">
                        <span class="text-muted-foreground">Server</span>
                        <span>{{ webspaceAccount.hosting_server?.hostname ?? '-' }}</span>
                    </div>
                    <div class="flex justify-between py-2 border-b">
                        <span class="text-muted-foreground">Status</span>
                        <Badge variant="secondary">{{ webspaceAccount.status }}</Badge>
                    </div>
                    <div class="flex justify-between py-2 border-b">
                        <span class="text-muted-foreground">Abo-Ende (aktueller Zeitraum)</span>
                        <span>{{ formatDate(webspaceAccount.current_period_ends_at) }}</span>
                    </div>
                    <div class="flex justify-between py-2 border-b">
                        <span class="text-muted-foreground">Kündigung zum Periodenende</span>
                        <span>{{ webspaceAccount.cancel_at_period_end ? 'Ja' : 'Nein' }}</span>
                    </div>
                    <div class="flex justify-between py-2 border-b">
                        <span class="text-muted-foreground">Beendet am</span>
                        <span>{{ formatDate(webspaceAccount.ends_at) }}</span>
                    </div>
                    <div class="flex justify-between py-2">
                        <span class="text-muted-foreground">Stripe Subscription</span>
                        <a
                            v-if="stripeDashboardUrl(webspaceAccount.stripe_subscription_id)"
                            :href="stripeDashboardUrl(webspaceAccount.stripe_subscription_id)!"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="text-primary hover:underline text-sm"
                        >
                            {{ webspaceAccount.stripe_subscription_id }}
                        </a>
                        <span v-else>-</span>
                    </div>
                </CardContent>
            </Card>
        </div>
    </AdminLayout>
</template>
