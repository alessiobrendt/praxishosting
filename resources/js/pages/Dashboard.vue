<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3';
import {
    Activity,
    Wallet,
    Coins,
    CalendarCheck,
    Trophy,
    HeartPulse,
    Server,
    Inbox,
    FileText,
    ExternalLink,
    Check,
    AlertTriangle,
    Layout,
    Globe,
    Gamepad2,
    KeyRound,
} from 'lucide-vue-next';
import { computed } from 'vue';
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from '@/components/ui/card';
import { Heading, Text } from '@/components/ui/typography';
import AppLayout from '@/layouts/AppLayout.vue';
import { dashboard } from '@/routes';
import billing from '@/routes/billing';
import postfach from '@/routes/postfach';
import type { BreadcrumbItem } from '@/types';

type Stats = {
    activeServicesCount: number;
    customerBalance: number | null;
    dueIn30Days: number;
    registeredAt: string;
    balanceTopUpUrl: string | null;
};

type StatusData = {
    level: string;
    label: string;
    balanceOk: boolean;
    balanceMessage: string | null;
    ticketsOk: boolean;
    ticketItems: Array<{ id: number; subject: string; url: string }>;
};

type FavoriteItem = { name: string; href: string };
type ActiveServiceItem = { name: string; url: string; type: string };
type RecentEmailItem = { id: number; subject: string; snippet: string | null; sent_at: string | null };
type RecentInvoiceItem = {
    id: number;
    number: string;
    amount: string;
    status: string;
    invoice_date: string | null;
    pdf_path: string | null;
    show_url: string;
};

type Props = {
    stats: Stats;
    status: StatusData;
    favorites: FavoriteItem[];
    activeServices: ActiveServiceItem[];
    recentEmails: RecentEmailItem[];
    recentInvoices: RecentInvoiceItem[];
    brandFeatures: Record<string, unknown>;
    supportPin: string;
    supportPinValidUntil: string;
};

const props = defineProps<Props>();

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
];

function formatCurrency(value: number): string {
    return new Intl.NumberFormat('de-DE', {
        style: 'currency',
        currency: 'EUR',
    }).format(value);
}

const showBalanceCard = computed(() => props.stats.customerBalance !== null);

const serviceTypeLabel: Record<string, string> = {
    site: 'Site',
    domain: 'Domain',
    webspace: 'Webspace',
    gaming: 'Game Server',
};

function getServiceTypeLabel(type: string): string {
    return serviceTypeLabel[type] ?? type;
}

const serviceTypeIcon = {
    site: Layout,
    domain: Globe,
    webspace: Server,
    gaming: Gamepad2,
};

function getServiceIcon(type: string) {
    return serviceTypeIcon[type as keyof typeof serviceTypeIcon] ?? Server;
}
</script>

<template>
    <Head title="Dashboard" />

    <AppLayout :breadcrumbs="breadcrumbs">
        <div class="space-y-6">
            <div>
                <Heading level="h1">Dashboard</Heading>
                <Text class="mt-2" muted>
                    Willkommen zurück! Hier ist eine Übersicht deiner Aktivitäten.
                </Text>
            </div>

            <!-- Stats: Karten füllen eine Zeile, Breite passt sich an -->
            <div class="grid w-full gap-4 grid-cols-[repeat(auto-fit,minmax(min(100%,11rem),1fr))]">
                <Card hover>
                    <CardContent class="flex flex-row items-center gap-4 pt-6">
                        <div class="rounded-lg bg-primary/10 p-3">
                            <Activity class="h-6 w-6 text-primary" />
                        </div>
                        <div class="min-w-0 flex-1">
                            <Text class="text-sm font-medium text-gray-500 dark:text-gray-400">
                                Aktive Dienste
                            </Text>
                            <p class="text-xl font-semibold truncate">
                                {{ stats.activeServicesCount }} Dienst{{ stats.activeServicesCount !== 1 ? 'e' : '' }}
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <Card v-if="showBalanceCard" hover>
                    <CardContent class="flex flex-row items-center gap-4 pt-6">
                        <div class="rounded-lg bg-green-100 p-3 dark:bg-green-900/30">
                            <Wallet class="h-6 w-6 text-green-600 dark:text-green-400" />
                        </div>
                        <div class="min-w-0 flex-1">
                            <Text class="text-sm font-medium text-gray-500 dark:text-gray-400">
                                Aktuelles Guthaben
                            </Text>
                            <p class="text-xl font-semibold truncate">
                                {{ formatCurrency(stats.customerBalance ?? 0) }}
                                <Link
                                    v-if="stats.balanceTopUpUrl"
                                    :href="stats.balanceTopUpUrl"
                                    class="ml-1 text-sm text-primary underline-offset-2 hover:underline"
                                >
                                    (aufladen)
                                </Link>
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <Card hover>
                    <CardContent class="flex flex-row items-center gap-4 pt-6">
                        <div class="rounded-lg bg-blue-100 p-3 dark:bg-blue-900/30">
                            <Coins class="h-6 w-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div class="min-w-0 flex-1">
                            <Text class="text-sm font-medium text-gray-500 dark:text-gray-400">
                                Fällig in nächste 30 Tage
                            </Text>
                            <p class="text-xl font-semibold truncate">
                                {{ formatCurrency(stats.dueIn30Days) }}
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <Card hover>
                    <CardContent class="flex flex-row items-center gap-4 pt-6">
                        <div class="rounded-lg bg-amber-100 p-3 dark:bg-amber-900/30">
                            <CalendarCheck class="h-6 w-6 text-amber-600 dark:text-amber-400" />
                        </div>
                        <div class="min-w-0 flex-1">
                            <Text class="text-sm font-medium text-gray-500 dark:text-gray-400">
                                Registrierung
                            </Text>
                            <p class="text-xl font-semibold truncate">
                                {{ stats.registeredAt || '–' }}
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <Card hover>
                    <CardContent class="flex flex-row items-center gap-4 pt-6">
                        <div class="rounded-lg bg-slate-100 p-3 dark:bg-slate-800/50">
                            <KeyRound class="h-6 w-6 text-slate-600 dark:text-slate-400" />
                        </div>
                        <div class="min-w-0 flex-1">
                            <Text class="text-sm font-medium text-gray-500 dark:text-gray-400">
                                Support-PIN
                            </Text>
                            <p class="font-mono text-xl font-semibold tracking-wider truncate">
                                {{ supportPin }}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <!-- Widgets -->
            <div class="grid gap-6 lg:grid-cols-2">
                <!-- Favoriten -->
                <Card>
                    <CardHeader>
                        <CardTitle class="flex items-center gap-2">
                            <Trophy class="h-5 w-5 text-primary" />
                            Favoriten
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div class="flex flex-wrap gap-2">
                            <Link
                                v-for="(fav, idx) in favorites"
                                :key="idx"
                                :href="fav.href"
                                class="inline-flex items-center rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700 transition-modern hover:bg-gray-100 hover:border-primary dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:border-primary"
                            >
                                {{ fav.name }}
                            </Link>
                        </div>
                    </CardContent>
                </Card>

                <!-- Dein Status -->
                <Card>
                    <CardHeader>
                        <CardTitle class="flex items-center gap-2">
                            <HeartPulse class="h-5 w-5 text-primary" />
                            Dein Status
                        </CardTitle>
                    </CardHeader>
                    <CardContent class="space-y-3">
                        <p
                            class="font-semibold"
                            :class="{
                                'text-green-600 dark:text-green-400': status.level === 'ok',
                                'text-amber-600 dark:text-amber-400': status.level === 'warning',
                                'text-red-600 dark:text-red-400': status.level === 'danger',
                            }"
                        >
                            <Check v-if="status.level === 'ok'" class="mr-1 inline h-4 w-4" />
                            <AlertTriangle v-else class="mr-1 inline h-4 w-4" />
                            {{ status.label }}
                        </p>
                        <ul class="space-y-1 text-sm text-gray-600 dark:text-gray-300">
                            <li v-if="status.balanceOk" class="flex items-center gap-2">
                                <Check class="h-4 w-4 shrink-0 text-green-500" />
                                Keine ungedeckten Zahlungen in den nächsten 7 Tagen
                            </li>
                            <li v-else class="flex items-start gap-2">
                                <AlertTriangle class="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
                                <span>{{ status.balanceMessage }}</span>
                            </li>
                            <li v-if="status.ticketsOk" class="flex items-center gap-2">
                                <Check class="h-4 w-4 shrink-0 text-green-500" />
                                Keine offenen, vom Support beantworteten Support-Tickets
                            </li>
                            <li v-else class="flex flex-col gap-1">
                                <span class="flex items-center gap-2">
                                    <AlertTriangle class="h-4 w-4 shrink-0 text-amber-500" />
                                    Es gibt offene, vom Support beantwortete Tickets:
                                </span>
                                <Link
                                    v-for="t in status.ticketItems"
                                    :key="t.id"
                                    :href="t.url"
                                    class="ml-6 text-primary underline-offset-2 hover:underline"
                                >
                                    {{ t.subject }}
                                </Link>
                            </li>
                        </ul>
                    </CardContent>
                </Card>

                <!-- Aktive Dienste (gleiche Listen-Optik wie Postfach: klare Abgrenzung pro Dienst) -->
                <Card>
                    <CardHeader>
                        <CardTitle class="flex items-center gap-2">
                            <Server class="h-5 w-5 text-primary" />
                            Aktive Dienste
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div v-if="activeServices.length" class="space-y-2">
                            <Link
                                v-for="(svc, idx) in activeServices"
                                :key="idx"
                                :href="svc.url"
                                class="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-gray-200 p-3 transition-modern hover:bg-gray-50 hover:border-gray-300 dark:border-gray-700 dark:hover:bg-gray-800/50 dark:hover:border-gray-600"
                            >
                                <div class="flex min-w-0 flex-1 items-center gap-3">
                                    <div
                                        class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary dark:bg-primary/20"
                                    >
                                        <component
                                            :is="getServiceIcon(svc.type)"
                                            class="h-5 w-5"
                                        />
                                    </div>
                                    <div class="min-w-0 flex-1">
                                        <span
                                            class="mb-0.5 inline-block rounded px-2 py-0.5 text-xs font-medium bg-primary/10 text-primary dark:bg-primary/20"
                                        >
                                            {{ getServiceTypeLabel(svc.type) }}
                                        </span>
                                        <p class="font-semibold text-gray-900 dark:text-gray-100 truncate">
                                            {{ svc.name }}
                                        </p>
                                    </div>
                                </div>
                                <span class="shrink-0 text-sm font-medium text-primary">
                                    Öffnen
                                    <ExternalLink class="ml-0.5 inline h-3.5 w-3.5" />
                                </span>
                            </Link>
                        </div>
                        <Text v-else muted class="block py-2">
                            Keine aktiven Dienste.
                        </Text>
                    </CardContent>
                </Card>

                <!-- Postfach (gleiche Listen-Optik wie Postfach-Seite: klare Abgrenzung pro E-Mail) -->
                <Card>
                    <CardHeader class="flex flex-row items-center justify-between space-y-0">
                        <CardTitle class="flex items-center gap-2">
                            <Inbox class="h-5 w-5 text-primary" />
                            Postfach
                        </CardTitle>
                        <Link
                            :href="postfach.index.url()"
                            class="text-sm font-medium text-primary underline-offset-2 hover:underline"
                        >
                            Alle anzeigen
                        </Link>
                    </CardHeader>
                    <CardContent>
                        <div v-if="recentEmails.length" class="space-y-2">
                            <Link
                                v-for="email in recentEmails"
                                :key="email.id"
                                :href="postfach.show.url(email.id)"
                                class="block rounded-lg border border-gray-200 p-3 transition-modern hover:bg-gray-50 hover:border-gray-300 dark:border-gray-700 dark:hover:bg-gray-800/50 dark:hover:border-gray-600"
                            >
                                <div class="flex flex-wrap items-start justify-between gap-2">
                                    <div class="min-w-0 flex-1">
                                        <p class="mb-0.5 font-semibold text-gray-900 dark:text-gray-100 truncate">
                                            {{ email.subject }}
                                        </p>
                                        <p class="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                                            {{ email.snippet || '…' }}
                                        </p>
                                    </div>
                                    <span
                                        v-if="email.sent_at"
                                        class="shrink-0 rounded px-2 py-0.5 text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-200"
                                    >
                                        {{ email.sent_at }}
                                    </span>
                                </div>
                            </Link>
                        </div>
                        <Text v-else muted class="block py-2">
                            Keine E-Mails im Postfach.
                        </Text>
                    </CardContent>
                </Card>

                <!-- Rechnungen (span full width on large so it sits below the 2-col grid or we keep 2-col) -->
                <Card class="lg:col-span-2">
                    <CardHeader class="flex flex-row items-center justify-between space-y-0">
                        <CardTitle class="flex items-center gap-2">
                            <FileText class="h-5 w-5 text-primary" />
                            Rechnungen
                        </CardTitle>
                        <Link
                            :href="billing.index.url()"
                            class="text-sm font-medium text-primary underline-offset-2 hover:underline"
                        >
                            Alle anzeigen
                        </Link>
                    </CardHeader>
                    <CardContent>
                        <ul v-if="recentInvoices.length" class="space-y-3">
                            <li
                                v-for="inv in recentInvoices"
                                :key="inv.id"
                                class="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-gray-100 p-3 dark:border-gray-800"
                            >
                                <div>
                                    <p class="font-medium">{{ inv.invoice_date }} – {{ inv.number }}</p>
                                    <Text variant="small" muted>
                                        {{ inv.status }}
                                    </Text>
                                </div>
                                <div class="flex items-center gap-2">
                                    <span class="font-semibold">{{ inv.amount }}</span>
                                    <Link
                                        :href="inv.show_url"
                                        class="inline-flex items-center gap-1 rounded bg-primary/10 px-2 py-1 text-sm font-medium text-primary hover:bg-primary/20"
                                    >
                                        Zur Rechnung
                                        <ExternalLink class="h-3 w-3" />
                                    </Link>
                                </div>
                            </li>
                        </ul>
                        <Text v-else muted class="block py-2">
                            Keine Rechnungen vorhanden.
                        </Text>
                    </CardContent>
                </Card>
            </div>
        </div>
    </AppLayout>
</template>
