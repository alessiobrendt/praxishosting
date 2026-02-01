<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3';
import { ref, onMounted } from 'vue';
import AppLayout from '@/layouts/AppLayout.vue';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Heading, Text } from '@/components/ui/typography';
import { Button } from '@/components/ui/button';
import AdminSearch from '@/components/AdminSearch.vue';
import { getAdminRecent } from '@/composables/useAdminRecent';
import type { AdminRecentItem } from '@/composables/useAdminRecent';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';

const recentItems = ref<AdminRecentItem[]>([]);

onMounted(() => {
    recentItems.value = getAdminRecent();
});

type Stats = {
    activeSubscriptions: number;
    sitesTotal: number;
    sitesLegacy: number;
    sitesSuspended: number;
    customersTotal: number;
    revenueToday: number;
    revenueMonth: number;
    revenueYear: number;
    unpaidSum: number;
    overdueCount: number;
    subscriptionsEndingThisWeek: number;
    cancellationsAtPeriodEnd: number;
};

type ActionItemExpiring = {
    site_id: number | null;
    site_name: string | null;
    current_period_ends_at: string | null;
};

type ActionItemInvoice = {
    id: number;
    number: string;
    user_id: number;
    user_name: string | null;
    status: string;
    due_date: string | null;
};

type ActionItemDunning = {
    id: number;
    number: string;
    user_id: number;
    user_name: string | null;
    max_level: number;
};

type ActionItems = {
    expiringSubscriptions: ActionItemExpiring[];
    overdueOrFailedInvoices: ActionItemInvoice[];
    openDunningInvoices: ActionItemDunning[];
};

type Props = {
    stats: Stats;
    actionItems: ActionItems;
};

const props = defineProps<Props>();

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Admin', href: '#' },
];
</script>

<template>
    <AppLayout :breadcrumbs="breadcrumbs">
        <Head title="Admin Dashboard" />

        <div class="space-y-6">
            <div>
                <Heading level="h1">Admin Dashboard</Heading>
                <Text class="mt-2" muted>
                    Übersicht Umsatz, Abos und Webseiten
                </Text>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Globale Suche</CardTitle>
                    <CardDescription>Sites, Kunden, Rechnungen, Abos (Stripe-ID) durchsuchen</CardDescription>
                </CardHeader>
                <CardContent>
                    <AdminSearch />
                </CardContent>
            </Card>

            <Card v-if="recentItems.length">
                <CardHeader>
                    <CardTitle>Zuletzt angesehen</CardTitle>
                    <CardDescription>Zuletzt geöffnete Sites und Kunden</CardDescription>
                </CardHeader>
                <CardContent>
                    <ul class="flex flex-wrap gap-2">
                        <li v-for="(item, i) in recentItems" :key="i">
                            <Link
                                :href="item.url"
                                class="rounded-md bg-muted px-2 py-1 text-sm text-primary hover:underline"
                            >
                                {{ item.label }}
                            </Link>
                        </li>
                    </ul>
                </CardContent>
            </Card>

            <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader>
                        <CardTitle class="text-sm font-medium">Umsatz heute</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <span class="text-2xl font-bold">{{ stats.revenueToday.toFixed(2) }} €</span>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle class="text-sm font-medium">Umsatz Monat</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <span class="text-2xl font-bold">{{ stats.revenueMonth.toFixed(2) }} €</span>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle class="text-sm font-medium">Umsatz Jahr</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <span class="text-2xl font-bold">{{ stats.revenueYear.toFixed(2) }} €</span>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle class="text-sm font-medium">Aktive Abos</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <span class="text-2xl font-bold">{{ stats.activeSubscriptions }}</span>
                    </CardContent>
                </Card>
            </div>

            <div class="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader>
                        <CardTitle class="text-sm font-medium">Webseiten gesamt</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <span class="text-2xl font-bold">{{ stats.sitesTotal }}</span>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle class="text-sm font-medium">Legacy-Webseiten</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <span class="text-2xl font-bold">{{ stats.sitesLegacy }}</span>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle class="text-sm font-medium">Gesperrte Webseiten</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <span class="text-2xl font-bold">{{ stats.sitesSuspended }}</span>
                        <div class="mt-2">
                            <Link :href="`/admin/sites?status=suspended`">
                                <Button variant="ghost" size="sm">Anzeigen</Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader>
                        <CardTitle class="text-sm font-medium">Offene Posten</CardTitle>
                        <CardDescription>Summe unbezahlter Rechnungen</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <span class="text-2xl font-bold">{{ stats.unpaidSum.toFixed(2) }} €</span>
                        <Text variant="small" muted class="mt-1 block">{{ stats.overdueCount }} überfällig</Text>
                        <div class="mt-2">
                            <Link href="/admin/invoices">
                                <Button variant="ghost" size="sm">Rechnungen</Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle class="text-sm font-medium">Abos diese Woche</CardTitle>
                        <CardDescription>Laufzeitende in dieser Woche</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <span class="text-2xl font-bold">{{ stats.subscriptionsEndingThisWeek }}</span>
                        <div class="mt-2">
                            <Link href="/admin/subscriptions">
                                <Button variant="ghost" size="sm">Abos</Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle class="text-sm font-medium">Kündigungen zum Periodenende</CardTitle>
                        <CardDescription>Abos mit Kündigung</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <span class="text-2xl font-bold">{{ stats.cancellationsAtPeriodEnd }}</span>
                        <div class="mt-2">
                            <Link href="/admin/subscriptions">
                                <Button variant="ghost" size="sm">Abos</Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card v-if="lastWebhookMinutesAgo !== undefined && lastWebhookMinutesAgo !== null">
                <CardHeader>
                    <CardTitle class="text-sm font-medium">Stripe Webhook</CardTitle>
                    <CardDescription>Letzter empfangener Webhook</CardDescription>
                </CardHeader>
                <CardContent>
                    <Text v-if="lastWebhookMinutesAgo !== null" class="text-sm">
                        Vor {{ lastWebhookMinutesAgo }} Minute(n)
                    </Text>
                    <Text v-else class="text-sm text-muted-foreground">
                        Kein Webhook empfangen (oder Cache leer)
                    </Text>
                </CardContent>
            </Card>

            <Card v-if="actionItems.expiringSubscriptions?.length || actionItems.overdueOrFailedInvoices?.length || actionItems.openDunningInvoices?.length">
                <CardHeader>
                    <CardTitle>Zu erledigen</CardTitle>
                    <CardDescription>Handlungsbedarf: Abos, Rechnungen, Mahnungen</CardDescription>
                </CardHeader>
                <CardContent class="space-y-6">
                    <div v-if="actionItems.expiringSubscriptions?.length">
                        <Text variant="small" muted class="font-medium">Abos, die in den nächsten 7 Tagen auslaufen</Text>
                        <ul class="mt-2 space-y-1">
                            <li v-for="(item, i) in actionItems.expiringSubscriptions" :key="i">
                                <Link
                                    v-if="item.site_id"
                                    :href="`/admin/sites/${item.site_id}`"
                                    class="text-primary hover:underline"
                                >
                                    {{ item.site_name }} – {{ item.current_period_ends_at }}
                                </Link>
                                <span v-else>{{ item.site_name }} – {{ item.current_period_ends_at }}</span>
                            </li>
                        </ul>
                    </div>
                    <div v-if="actionItems.overdueOrFailedInvoices?.length">
                        <Text variant="small" muted class="font-medium">Rechnungen überfällig oder Zahlung fehlgeschlagen</Text>
                        <ul class="mt-2 space-y-1">
                            <li v-for="inv in actionItems.overdueOrFailedInvoices" :key="inv.id">
                                <Link :href="`/admin/invoices/${inv.id}`" class="text-primary hover:underline">
                                    Rechnung {{ inv.number }}
                                </Link>
                                <span class="text-muted-foreground"> · {{ inv.status }}</span>
                                <Link
                                    v-if="inv.user_id"
                                    :href="`/admin/customers/${inv.user_id}`"
                                    class="ml-1 text-primary hover:underline"
                                >
                                    ({{ inv.user_name }})
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div v-if="actionItems.openDunningInvoices?.length">
                        <Text variant="small" muted class="font-medium">Offene Mahnungen (2. oder 3. Mahnung ohne Zahlung)</Text>
                        <ul class="mt-2 space-y-1">
                            <li v-for="inv in actionItems.openDunningInvoices" :key="inv.id">
                                <Link :href="`/admin/invoices/${inv.id}`" class="text-primary hover:underline">
                                    Rechnung {{ inv.number }} (Mahnstufe {{ inv.max_level }})
                                </Link>
                                <Link
                                    v-if="inv.user_id"
                                    :href="`/admin/customers/${inv.user_id}`"
                                    class="ml-1 text-primary hover:underline"
                                >
                                    ({{ inv.user_name }})
                                </Link>
                            </li>
                        </ul>
                    </div>
                </CardContent>
            </Card>
        </div>
    </AppLayout>
</template>
