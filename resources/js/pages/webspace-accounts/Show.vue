<script setup lang="ts">
import { Head, Link, usePage } from '@inertiajs/vue3';
import { Eye, EyeOff, Copy, ExternalLink, Mail, Server, LayoutDashboard, KeyRound, CalendarPlus, Calendar, RefreshCcw } from 'lucide-vue-next';
import { ref, computed } from 'vue';
import AutoRenewModal from '@/components/AutoRenewModal.vue';
import PaymentMethodModal from '@/components/PaymentMethodModal.vue';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
} from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Heading, Text } from '@/components/ui/typography';
import AppLayout from '@/layouts/AppLayout.vue';
import { dashboard } from '@/routes';
import webspaceAccounts, { autoRenewBalance, autoRenewMollieSubscription } from '@/routes/webspace-accounts';
import type { BreadcrumbItem } from '@/types';

type WebspaceAccount = {
    id: number;
    domain: string;
    plesk_username: string;
    status: string;
    current_period_ends_at: string | null;
    cancel_at_period_end: boolean;
    hosting_plan: { name: string };
};

type ResourceUsage = {
    disk_used_bytes: number;
    disk_limit_bytes: number;
    domains_used: number;
    domains_limit: number;
    subdomains_used: number;
    subdomains_limit: number;
    mailboxes_used: number;
    mailboxes_limit: number;
    databases_used: number;
    databases_limit: number;
};

type Props = {
    webspaceAccount: WebspaceAccount;
    pleskPassword: string | null;
    webmailUrl: string;
    resourceUsage: ResourceUsage | null;
    canRenew?: boolean;
    renewalAmount?: number;
    canPayWithBalance?: boolean;
    customerBalance?: number;
    renewUrl?: string;
    isSuspendedOrExpired?: boolean;
    auto_renew_with_balance?: boolean;
    has_mollie_subscription?: boolean;
};

const props = withDefaults(defineProps<Props>(), {
    resourceUsage: null,
    canRenew: false,
    renewalAmount: 0,
    canPayWithBalance: false,
    customerBalance: 0,
    renewUrl: '',
    isSuspendedOrExpired: false,
    auto_renew_with_balance: false,
    has_mollie_subscription: false,
});

const showPassword = ref(false);
const renewModalOpen = ref(false);
const autoRenewModalOpen = ref(false);

const renewalPeriodOptions: { months: 1 | 2 | 3; label: string }[] = [
    { months: 1, label: '30 Tage (1 Monat)' },
    { months: 2, label: '60 Tage (2 Monate)' },
    { months: 3, label: '90 Tage (3 Monate)' },
];

const page = usePage();
const brandFeatures = computed(() => (page.props.brandFeatures as Record<string, boolean> | undefined) ?? {});
const showAboVerwalten = computed(() => !brandFeatures.value?.prepaid_balance);
const showAutoRenewButton = computed(
    () => props.canRenew && props.renewUrl && brandFeatures.value?.prepaid_balance === true,
);

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Meine Webspace-Accounts', href: '/webspace-accounts' },
    { title: props.webspaceAccount.domain, href: '#' },
];

const formatDate = (d: string | null) =>
    d ? new Date(d).toLocaleDateString('de-DE', { timeZone: 'UTC' }) : '–';

const displayPassword = computed(() =>
    props.pleskPassword
        ? showPassword.value
            ? props.pleskPassword
            : '••••••••••••••••••••'
        : '—'
);

function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
}

function statusVariant(status: string): 'success' | 'default' | 'error' {
    const s = status?.toLowerCase() ?? '';
    if (s === 'active' || s === 'aktiv') return 'success';
    if (s === 'suspended' || s === 'gesperrt' || s === 'cancelled') return 'error';
    return 'default';
}

function displayStatus(status: string): string {
    const s = status?.toLowerCase() ?? '';
    if (s === 'active' || s === 'aktiv') return 'Aktiv';
    if (s === 'pending' || s === 'ausstehend') return 'Ausstehend';
    if (s === 'suspended' || s === 'gesperrt') return 'Gesperrt';
    if (s === 'cancelled') return 'Gekündigt';
    return status || '–';
}

function formatBytesToGb(bytes: number): string {
    if (bytes === 0) return '0,00';
    const gb = bytes / (1024 * 1024 * 1024);
    return gb.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function resourcePercent(used: number, limit: number): number {
    if (limit <= 0) return 0;
    return Math.min(100, Math.round((used / limit) * 100));
}
</script>

<template>
    <AppLayout :breadcrumbs="breadcrumbs">
        <Head :title="webspaceAccount.domain" />

        <div class="grid grid-cols-1 gap-6 lg:grid-cols-4">
            <!-- Sidebar (wie Gaming-Accounts) -->
            <div class="lg:col-span-1">
                <Card class="rounded-lg p-4">
                    <div class="border-b pb-3 text-center">
                        <div class="mb-3 flex items-center justify-between">
                            <Badge :variant="statusVariant(webspaceAccount.status)" class="gap-1">
                                <span
                                    v-if="statusVariant(webspaceAccount.status) === 'success'"
                                    class="relative flex h-1.5 w-1.5"
                                >
                                    <span
                                        class="absolute inline-flex h-full w-full animate-ping rounded-full bg-current opacity-75"
                                    />
                                    <span class="relative inline-flex h-1.5 w-1.5 rounded-full bg-current" />
                                </span>
                                {{ displayStatus(webspaceAccount.status) }}
                            </Badge>
                        </div>
                        <div class="flex justify-center text-muted-foreground">
                            <Server class="h-12 w-12" />
                        </div>
                        <Heading level="h5" class="mt-2">Webspace</Heading>
                        <Text class="mt-0.5 font-mono text-sm" muted>{{ webspaceAccount.domain }}</Text>
                        <Text class="mt-0.5 text-xs" muted>{{ webspaceAccount.hosting_plan.name }}</Text>
                        <div class="mt-3 rounded-lg border bg-muted/40 px-3 py-2 text-center">
                            <div class="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                                <Calendar class="h-3.5 w-3.5 shrink-0" />
                                <span>Läuft bis</span>
                            </div>
                            <div class="mt-0.5 text-sm font-semibold">{{ formatDate(webspaceAccount.current_period_ends_at) }}</div>
                            <div v-if="webspaceAccount.cancel_at_period_end" class="mt-1 text-xs text-amber-600 dark:text-amber-400">
                                Kündigung zum Periodenende
                            </div>
                        </div>
                    </div>
                    <div class="mt-4 flex flex-col gap-3">
                        <template v-if="isSuspendedOrExpired">
                            <Button class="w-full justify-start gap-2" disabled>
                                <ExternalLink class="h-4 w-4" />
                                Gesperrt – bitte verlängern
                            </Button>
                        </template>
                        <a
                            v-else
                            :href="`/webspace-accounts/${webspaceAccount.id}/plesk-login`"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="inline-block w-full"
                        >
                            <Button class="w-full justify-start gap-2">
                                <ExternalLink class="h-4 w-4" />
                                Zum Plesk-Panel
                            </Button>
                        </a>
                        <template v-if="canRenew && renewUrl">
                            <Button
                                variant="default"
                                class="w-full justify-start gap-2"
                                @click="renewModalOpen = true"
                            >
                                <CalendarPlus class="h-4 w-4" />
                                Verlängern
                            </Button>
                        </template>
                        <template v-if="showAutoRenewButton">
                            <Button
                                variant="outline"
                                class="w-full justify-start gap-2"
                                @click="autoRenewModalOpen = true"
                            >
                                <RefreshCcw class="h-4 w-4" />
                                Auto Renew
                            </Button>
                        </template>
                        <Link v-if="showAboVerwalten" href="/billing/subscriptions">
                            <Button variant="outline" class="w-full justify-start gap-2">
                                Abo verwalten
                            </Button>
                        </Link>
                    </div>
                </Card>
            </div>

            <!-- Hauptbereich: Tabs -->
            <div class="lg:col-span-3">
                <Tabs default-tab="overview" class="w-full">
                    <TabsList
                        class="mb-4 flex h-auto flex-wrap justify-start gap-1 rounded-lg bg-white p-1 dark:bg-muted/50"
                    >
                        <TabsTrigger value="overview" class="gap-2 px-3 py-2">
                            <LayoutDashboard class="h-4 w-4" />
                            <span class="hidden sm:inline">Übersicht</span>
                        </TabsTrigger>
                        <TabsTrigger value="access" class="gap-2 px-3 py-2">
                            <KeyRound class="h-4 w-4" />
                            <span class="hidden sm:inline">Zugang</span>
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" class="mt-0">
                        <div class="grid gap-4 md:grid-cols-2">
                            <!-- Informationen -->
                            <Card>
                                <CardHeader>
                                    <CardTitle>Informationen</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <Table>
                                        <TableBody>
                                            <TableRow>
                                                <TableHead class="w-36 font-medium">Domain</TableHead>
                                                <TableCell class="font-mono text-sm">{{ webspaceAccount.domain }}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableHead class="font-medium">Plesk-Nutzername</TableHead>
                                                <TableCell class="font-mono text-sm">
                                                    {{ webspaceAccount.plesk_username }}
                                                </TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableHead class="font-medium">Status</TableHead>
                                                <TableCell>
                                                    <Badge :variant="statusVariant(webspaceAccount.status)">
                                                        {{ displayStatus(webspaceAccount.status) }}
                                                    </Badge>
                                                </TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableHead class="font-medium">Paket</TableHead>
                                                <TableCell>{{ webspaceAccount.hosting_plan.name }}</TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>

                            <!-- Abo (nur bei Abo-Marken) oder Genutzte Ressourcen (bei Prepaid in der Lücke) -->
                            <Card v-if="showAboVerwalten">
                                <CardHeader>
                                    <CardTitle>Abo</CardTitle>
                                    <CardDescription>Verlängerung und Kündigung</CardDescription>
                                </CardHeader>
                                <CardContent class="space-y-4">
                                    <dl class="grid gap-2 text-sm">
                                        <div class="flex justify-between border-b py-2">
                                            <dt class="text-muted-foreground">Nächste Verlängerung</dt>
                                            <dd>{{ formatDate(webspaceAccount.current_period_ends_at) }}</dd>
                                        </div>
                                        <div class="flex justify-between py-2">
                                            <span class="text-muted-foreground">Kündigung zum Periodenende</span>
                                            <Badge v-if="webspaceAccount.cancel_at_period_end" variant="default">
                                                Ja
                                            </Badge>
                                            <span v-else>Nein</span>
                                        </div>
                                    </dl>
                                    <Link href="/billing/subscriptions">
                                        <Button variant="outline" class="w-full">Abo im Kundenbereich verwalten</Button>
                                    </Link>
                                </CardContent>
                            </Card>
                            <!-- Bei Prepaid: Genutzte Ressourcen in die gleiche Grid-Position -->
                            <Card v-else-if="resourceUsage" class="resource-usage-card">
                                <CardHeader>
                                    <CardTitle>Genutzte Ressourcen</CardTitle>
                                    <CardDescription>
                                        Speicherplatz und Kontingente aus dem Plesk-Panel
                                    </CardDescription>
                                </CardHeader>
                                <CardContent class="space-y-4">
                                    <div>
                                        <div class="mb-1 flex justify-between text-sm">
                                            <span class="font-medium">Speicherplatz</span>
                                            <span class="text-muted-foreground">
                                                {{ formatBytesToGb(resourceUsage.disk_used_bytes) }} / {{ formatBytesToGb(resourceUsage.disk_limit_bytes) }} GB
                                            </span>
                                        </div>
                                        <div class="h-2 rounded-full bg-muted">
                                            <div
                                                class="h-full rounded-full bg-primary transition-all"
                                                :style="{ width: `${resourcePercent(resourceUsage.disk_used_bytes, resourceUsage.disk_limit_bytes)}%` }"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <div class="mb-1 flex justify-between text-sm">
                                            <span class="font-medium">Domains</span>
                                            <span class="text-muted-foreground">{{ resourceUsage.domains_used }} / {{ resourceUsage.domains_limit }}</span>
                                        </div>
                                        <div class="h-2 rounded-full bg-muted">
                                            <div
                                                class="h-full rounded-full bg-primary transition-all"
                                                :style="{ width: `${resourcePercent(resourceUsage.domains_used, resourceUsage.domains_limit)}%` }"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <div class="mb-1 flex justify-between text-sm">
                                            <span class="font-medium">E-Mail-Postfächer</span>
                                            <span class="text-muted-foreground">{{ resourceUsage.mailboxes_used }} / {{ resourceUsage.mailboxes_limit }}</span>
                                        </div>
                                        <div class="h-2 rounded-full bg-muted">
                                            <div
                                                class="h-full rounded-full bg-primary transition-all"
                                                :style="{ width: `${resourcePercent(resourceUsage.mailboxes_used, resourceUsage.mailboxes_limit)}%` }"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <div class="mb-1 flex justify-between text-sm">
                                            <span class="font-medium">Datenbanken</span>
                                            <span class="text-muted-foreground">{{ resourceUsage.databases_used }} / {{ resourceUsage.databases_limit }}</span>
                                        </div>
                                        <div class="h-2 rounded-full bg-muted">
                                            <div
                                                class="h-full rounded-full bg-primary transition-all"
                                                :style="{ width: `${resourcePercent(resourceUsage.databases_used, resourceUsage.databases_limit)}%` }"
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <!-- Genutzte Ressourcen unter dem Grid (nur wenn Abo-Karte oben gezeigt wurde) -->
                        <Card v-if="showAboVerwalten && resourceUsage" class="mt-4">
                            <CardHeader>
                                <CardTitle>Genutzte Ressourcen</CardTitle>
                                <CardDescription>
                                    Speicherplatz und Kontingente aus dem Plesk-Panel
                                </CardDescription>
                            </CardHeader>
                            <CardContent class="space-y-6">
                                <div class="space-y-4">
                                    <div>
                                        <div class="mb-1 flex items-center justify-between">
                                            <span class="text-sm font-semibold">Speicherplatz</span>
                                            <span class="text-sm text-muted-foreground">
                                                {{ formatBytesToGb(resourceUsage.disk_used_bytes) }} GB von
                                                {{ formatBytesToGb(resourceUsage.disk_limit_bytes) }} GB
                                            </span>
                                        </div>
                                        <div class="h-3 overflow-hidden rounded-full bg-muted">
                                            <div
                                                class="h-full rounded-full bg-primary transition-all"
                                                :style="{
                                                    width: `${resourcePercent(resourceUsage.disk_used_bytes, resourceUsage.disk_limit_bytes)}%`,
                                                }"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <div class="mb-1 flex items-center justify-between">
                                            <span class="text-sm font-semibold">Domains</span>
                                            <span class="text-sm text-muted-foreground">
                                                {{ resourceUsage.domains_used }} von {{ resourceUsage.domains_limit }}
                                            </span>
                                        </div>
                                        <div class="h-3 overflow-hidden rounded-full bg-muted">
                                            <div
                                                class="h-full rounded-full bg-primary transition-all"
                                                :style="{
                                                    width: `${resourcePercent(resourceUsage.domains_used, resourceUsage.domains_limit)}%`,
                                                }"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <div class="mb-1 flex items-center justify-between">
                                            <span class="text-sm font-semibold">Subdomains</span>
                                            <span class="text-sm text-muted-foreground">
                                                {{ resourceUsage.subdomains_used }} von
                                                {{ resourceUsage.subdomains_limit }}
                                            </span>
                                        </div>
                                        <div class="h-3 overflow-hidden rounded-full bg-muted">
                                            <div
                                                class="h-full rounded-full bg-primary transition-all"
                                                :style="{
                                                    width: `${resourcePercent(resourceUsage.subdomains_used, resourceUsage.subdomains_limit)}%`,
                                                }"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <div class="mb-1 flex items-center justify-between">
                                            <span class="text-sm font-semibold">E-Mail-Postfächer</span>
                                            <span class="text-sm text-muted-foreground">
                                                {{ resourceUsage.mailboxes_used }} von
                                                {{ resourceUsage.mailboxes_limit }}
                                            </span>
                                        </div>
                                        <div class="h-3 overflow-hidden rounded-full bg-muted">
                                            <div
                                                class="h-full rounded-full bg-primary transition-all"
                                                :style="{
                                                    width: `${resourcePercent(resourceUsage.mailboxes_used, resourceUsage.mailboxes_limit)}%`,
                                                }"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <div class="mb-1 flex items-center justify-between">
                                            <span class="text-sm font-semibold">Datenbanken</span>
                                            <span class="text-sm text-muted-foreground">
                                                {{ resourceUsage.databases_used }} von
                                                {{ resourceUsage.databases_limit }}
                                            </span>
                                        </div>
                                        <div class="h-3 overflow-hidden rounded-full bg-muted">
                                            <div
                                                class="h-full rounded-full bg-primary transition-all"
                                                :style="{
                                                    width: `${resourcePercent(resourceUsage.databases_used, resourceUsage.databases_limit)}%`,
                                                }"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="access" class="mt-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Zugangsdaten (Plesk / FTP)</CardTitle>
                                <CardDescription>
                                    Nutzername und Passwort für Plesk-Kundenpanel und FTP. Mail-Postfächer können
                                    eigene Zugänge haben.
                                </CardDescription>
                            </CardHeader>
                            <CardContent class="space-y-4">
                                <div class="space-y-2">
                                    <label class="text-sm font-medium">Nutzername</label>
                                    <div class="flex gap-2">
                                        <Input
                                            :model-value="webspaceAccount.plesk_username"
                                            readonly
                                            class="font-mono bg-muted"
                                        />
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="icon"
                                            title="Kopieren"
                                            @click="copyToClipboard(webspaceAccount.plesk_username)"
                                        >
                                            <Copy class="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                                <div class="space-y-2">
                                    <label class="text-sm font-medium">Passwort</label>
                                    <div class="flex gap-2">
                                        <Input
                                            :model-value="displayPassword"
                                            readonly
                                            class="font-mono bg-muted"
                                            :type="showPassword ? 'text' : 'password'"
                                        />
                                        <Button
                                            v-if="pleskPassword"
                                            type="button"
                                            variant="outline"
                                            size="icon"
                                            :title="showPassword ? 'Verbergen' : 'Anzeigen'"
                                            @click="showPassword = !showPassword"
                                        >
                                            <Eye v-if="!showPassword" class="h-4 w-4" />
                                            <EyeOff v-else class="h-4 w-4" />
                                        </Button>
                                        <Button
                                            v-if="pleskPassword"
                                            type="button"
                                            variant="outline"
                                            size="icon"
                                            title="Kopieren"
                                            @click="copyToClipboard(pleskPassword)"
                                        >
                                            <Copy class="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                                <div class="flex flex-wrap gap-3 pt-2">
                                    <template v-if="isSuspendedOrExpired">
                                        <Button disabled>
                                            <ExternalLink class="mr-2 h-4 w-4" />
                                            Gesperrt – bitte verlängern
                                        </Button>
                                    </template>
                                    <a
                                        v-else
                                        :href="`/webspace-accounts/${webspaceAccount.id}/plesk-login`"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <Button>
                                            <ExternalLink class="mr-2 h-4 w-4" />
                                            In Plesk anmelden
                                        </Button>
                                    </a>
                                    <a :href="webmailUrl" target="_blank" rel="noopener noreferrer">
                                        <Button variant="outline">
                                            <Mail class="mr-2 h-4 w-4" />
                                            Webmail öffnen
                                        </Button>
                                    </a>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>

        <PaymentMethodModal
            v-if="canRenew && renewUrl"
            :open="renewModalOpen"
            :amount="renewalAmount"
            title="Verlängerung bezahlen"
            description="Webspace verlängern."
            :can-pay-with-balance="canPayWithBalance"
            :customer-balance="customerBalance"
            :submit-url="renewUrl"
            :period-options="renewalPeriodOptions"
            :base-amount-per-month="renewalAmount"
            @update:open="renewModalOpen = $event"
        />
        <AutoRenewModal
            v-if="showAutoRenewButton"
            :open="autoRenewModalOpen"
            :balance-url="autoRenewBalance.url(props.webspaceAccount.id)"
            :mollie-url="autoRenewMollieSubscription.url(props.webspaceAccount.id)"
            :mollie-cancel-url="webspaceAccounts.subscription.cancel.url(props.webspaceAccount.id)"
            :auto-renew-with-balance="props.auto_renew_with_balance"
            :has-mollie-subscription="props.has_mollie_subscription"
            @update:open="autoRenewModalOpen = $event"
        />
    </AppLayout>
</template>
