<script setup lang="ts">
import { Head, router, usePage } from '@inertiajs/vue3';
import {
    ExternalLink,
    Sparkles,
    Wallet,
    Coins,
    Pencil,
    Lock,
    ArrowRight,
    Shield,
    Zap,
    Ban,
    Headset,
    Receipt,
} from 'lucide-vue-next';
import { watch, computed } from 'vue';
import { ref } from 'vue';
import PaymentMethodLogo from '@/components/PaymentMethodLogo.vue';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
} from '@/components/ui/table';
import { Heading, Text } from '@/components/ui/typography';
import { notify } from '@/composables/useNotify';
import AppLayout from '@/layouts/AppLayout.vue';
import { dashboard } from '@/routes';
import billing from '@/routes/billing';
import type { BreadcrumbItem } from '@/types';

const QUICK_AMOUNTS = [
    { value: 5 },
    { value: 10 },
    { value: 20, badge: 'Beliebt' },
    { value: 50, badge: 'Empfohlen' },
    { value: 100 },
    { value: 200 },
] as const;
const BALANCE_TOPUP_MIN = 5;
const BALANCE_TOPUP_MAX = 500;

type Invoice = {
    id: number;
    number: string;
    amount: string;
    status: string;
    invoice_date: string;
    pdf_path: string | null;
    invoice_xml_path: string | null;
};

type PaymentMethodSummary = {
    brand: string;
    last4: string;
};

type AiTokenPackage = {
    amount: number;
    label: string;
};

type BalanceTransactionItem = {
    id: number;
    amount: number;
    type: string;
    description: string | null;
    created_at: string;
};

type Props = {
    invoices: Invoice[];
    billingPortalUrl: string;
    paymentMethodSummary: PaymentMethodSummary | null;
    aiTokensEnabled: boolean;
    aiTokenBalance: number;
    aiTokenPackages: AiTokenPackage[];
    prepaidEnabled?: boolean;
    customerBalance?: number;
    balanceTransactions?: BalanceTransactionItem[];
    balanceTopUpEnabled?: boolean;
    balanceTopUpMinAmount?: number;
    balanceCheckoutUrl?: string;
};

const props = defineProps<Props>();

const balanceTopUpAmount = ref<number>(props.balanceTopUpMinAmount ?? 5);
const balanceTopUpSubmitting = ref(false);
const selectedPaymentMethod = ref<string>('');

function checkoutAiTokens(amount: number): void {
    router.post(billing.aiTokens.checkout.url(), { token_amount: amount }, {
        preserveScroll: true,
        preserveState: true,
    });
}

const balanceTopUpMin = computed(() => props.balanceTopUpMinAmount ?? BALANCE_TOPUP_MIN);

function setQuickAmount(amount: number): void {
    balanceTopUpAmount.value = amount;
}

function submitBalanceTopUp(): void {
    const url = props.balanceCheckoutUrl;
    const min = balanceTopUpMin.value;
    if (!url || balanceTopUpAmount.value < min) return;
    balanceTopUpSubmitting.value = true;
    const payload: { amount: number; method?: string } = { amount: balanceTopUpAmount.value };
    if (selectedPaymentMethod.value) {
        payload.method = selectedPaymentMethod.value;
    }
    router.post(url, payload, {
        preserveScroll: true,
        preserveState: true,
        onFinish: () => { balanceTopUpSubmitting.value = false; },
    });
}

const summaryAmount = computed(() => {
    const raw = Number(balanceTopUpAmount.value) || 0;
    const min = balanceTopUpMin.value;
    const clamped = Math.min(BALANCE_TOPUP_MAX, Math.max(0, raw));
    return clamped >= min ? clamped : 0;
});
const summaryFormatted = computed(() =>
    summaryAmount.value.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
);

const page = usePage();
// Zahlungsmethoden vom Server (Mollie API GET /v2/methods)
const molliePaymentMethods = computed(
    () => (page.props.molliePaymentMethods as { type: string; label: string }[]) ?? [],
);
watch(
    molliePaymentMethods,
    (methods) => {
        if (methods.length && !selectedPaymentMethod.value) {
            selectedPaymentMethod.value = methods[0].type;
        }
    },
    { immediate: true },
);

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

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Meine Rechnungen', href: '#' },
];
</script>

<template>
    <AppLayout :breadcrumbs="breadcrumbs">
        <Head title="Meine Rechnungen" />

        <div class="space-y-6">
            <div>
                <Heading level="h1">Meine Rechnungen</Heading>
                <Text class="mt-2" muted>
                    Ihre letzten Rechnungen mit PDF- und E-Rechnung-Download sowie Ihre Zahlungsart
                </Text>
            </div>

            <!-- Meine Rechnungen -->
            <Card>
                <CardHeader>
                    <CardTitle>Meine Rechnungen</CardTitle>
                    <CardDescription>Ihre letzten Rechnungen mit PDF- und E-Rechnung-Download</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table v-if="invoices?.length">
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nummer</TableHead>
                                <TableHead>Betrag</TableHead>
                                <TableHead>Datum</TableHead>
                                <TableHead class="text-right">Aktionen</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow v-for="inv in invoices" :key="inv.uuid">
                                <TableCell>
                                    <code class="text-sm">{{ inv.number }}</code>
                                </TableCell>
                                <TableCell>{{ inv.amount }} €</TableCell>
                                <TableCell>{{ inv.invoice_date }}</TableCell>
                                <TableCell class="text-right">
                                    <a
                                        :href="`/invoices/${inv.uuid}`"
                                        class="text-primary hover:underline font-medium"
                                    >
                                        Rechnung anzeigen
                                    </a>
                                    <template v-if="inv.pdf_path || inv.invoice_xml_path">
                                        <span class="text-muted-foreground mx-1">·</span>
                                        <a
                                            v-if="inv.pdf_path"
                                            :href="`/invoices/${inv.uuid}/pdf`"
                                            target="_blank"
                                            rel="noopener"
                                            class="text-muted-foreground hover:underline text-sm"
                                        >
                                            PDF
                                        </a>
                                        <a
                                            v-if="inv.invoice_xml_path"
                                            :href="`/invoices/${inv.uuid}/xml`"
                                            target="_blank"
                                            rel="noopener"
                                            class="text-muted-foreground hover:underline text-sm ml-1"
                                        >
                                            XML
                                        </a>
                                    </template>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                    <p v-else class="text-muted text-sm">Noch keine Rechnungen vorhanden.</p>
                </CardContent>
            </Card>

            <!-- Guthaben (Prepaid) -->
            <Card v-if="props.prepaidEnabled">
                <CardHeader>
                    <CardTitle class="flex items-center gap-2">
                        <Wallet class="h-5 w-5" />
                        Guthaben
                    </CardTitle>
                    <CardDescription>
                        Aktueller Stand: {{ (props.customerBalance ?? 0).toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }} €
                        <template v-if="props.balanceTopUpEnabled">
                            – Guthaben können Sie per Karte aufladen (Mindestbetrag {{ balanceTopUpMin.toLocaleString('de-DE', { minimumFractionDigits: 2 }) }} €).
                        </template>
                    </CardDescription>
                </CardHeader>
                <CardContent class="space-y-4">
                    <Table v-if="props.balanceTransactions?.length">
                        <TableHeader>
                            <TableRow>
                                <TableHead>Datum</TableHead>
                                <TableHead>Betrag</TableHead>
                                <TableHead>Beschreibung</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow v-for="tx in props.balanceTransactions" :key="tx.id">
                                <TableCell>{{ tx.created_at }}</TableCell>
                                <TableCell>
                                    <span :class="tx.amount >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'">
                                        {{ tx.amount >= 0 ? '+' : '' }}{{ tx.amount.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }} €
                                    </span>
                                </TableCell>
                                <TableCell>{{ tx.description || tx.type }}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                    <p v-else class="text-muted text-sm">Noch keine Transaktionen.</p>

                    <!-- Guthaben aufladen: 2-Spalten-Layout (Hauptbereich + Sidebar) -->
                    <div
                        v-if="props.balanceTopUpEnabled && props.balanceCheckoutUrl"
                        class="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]"
                    >
                        <div class="space-y-6">
                            <!-- Schritt 1: Betrag wählen -->
                            <Card class="overflow-hidden">
                                <CardHeader class="pb-3">
                                    <CardTitle class="flex items-center gap-2 text-base font-semibold">
                                        <span
                                            class="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-sm font-extrabold text-primary"
                                        >
                                            1
                                        </span>
                                        Betrag wählen
                                    </CardTitle>
                                </CardHeader>
                                <CardContent class="space-y-4">
                                    <div>
                                        <p class="mb-2 flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                            <Coins class="h-4 w-4 text-primary" />
                                            Schnellauswahl
                                        </p>
                                        <div class="grid grid-cols-2 gap-2 sm:grid-cols-3">
                                            <button
                                                v-for="opt in QUICK_AMOUNTS"
                                                :key="opt.value"
                                                type="button"
                                                class="relative flex flex-col items-center justify-center rounded-xl border-2 bg-muted/30 py-4 transition-all hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
                                                :class="balanceTopUpAmount === opt.value ? 'border-primary bg-primary/5 ring-2 ring-primary/20' : 'border-border'"
                                                @click="setQuickAmount(opt.value)"
                                            >
                                                <span
                                                    v-if="opt.badge"
                                                    class="absolute -top-1.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full px-2 py-0.5 text-[10px] font-medium"
                                                    :class="opt.badge === 'Beliebt' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-200' : 'bg-primary/15 text-primary'"
                                                >
                                                    {{ opt.badge === 'Beliebt' ? '⭐ ' : '💰 ' }}{{ opt.badge }}
                                                </span>
                                                <span class="text-lg font-bold">{{ opt.value }}€</span>
                                            </button>
                                        </div>
                                    </div>
                                    <div>
                                        <p class="mb-2 flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                            <Pencil class="h-4 w-4 text-primary" />
                                            Oder eigenen Betrag eingeben
                                        </p>
                                        <div class="flex flex-col gap-1">
                                            <div class="flex items-center overflow-hidden rounded-lg border bg-background">
                                                <span class="flex items-center justify-center bg-muted/50 px-3 py-2.5 text-sm font-medium text-muted-foreground">€</span>
                                                <Input
                                                    v-model.number="balanceTopUpAmount"
                                                    type="number"
                                                    step="0.01"
                                                    :min="balanceTopUpMin"
                                                    :max="BALANCE_TOPUP_MAX"
                                                    placeholder="Wunschbetrag..."
                                                    class="min-w-0 border-0 bg-transparent focus-visible:ring-0"
                                                />
                                            </div>
                                            <p class="text-xs text-muted-foreground">{{ balanceTopUpMin }} – {{ BALANCE_TOPUP_MAX }} €</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <!-- Schritt 2: Zahlungsart wählen -->
                            <Card class="overflow-hidden">
                                <CardHeader class="pb-3">
                                    <CardTitle class="flex items-center gap-2 text-base font-semibold">
                                        <span
                                            class="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-sm font-extrabold text-primary"
                                        >
                                            2
                                        </span>
                                        Zahlungsart wählen
                                    </CardTitle>
                                </CardHeader>
                                <CardContent class="space-y-4">
                                    <div class="grid grid-cols-2 gap-2 sm:grid-cols-3">
                                        <label
                                            v-for="method in molliePaymentMethods"
                                            :key="method.type"
                                            class="relative flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all hover:bg-muted/30"
                                            :class="selectedPaymentMethod === method.type ? 'border-primary bg-primary/5 ring-2 ring-primary/20' : 'border-border'"
                                        >
                                            <input
                                                v-model="selectedPaymentMethod"
                                                type="radio"
                                                :value="method.type"
                                                name="balance_topup_method"
                                                class="sr-only"
                                            />
                                            <PaymentMethodLogo :type="method.type" :size="32" />
                                            <span class="text-center text-sm font-medium">{{ method.label }}</span>
                                            <span
                                                v-if="selectedPaymentMethod === method.type"
                                                class="absolute right-2 top-2 text-primary"
                                                aria-hidden
                                            >
                                                <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                                                </svg>
                                            </span>
                                        </label>
                                    </div>
                                    <p class="text-xs text-muted-foreground">
                                        Sie werden zur sicheren Zahlungsseite weitergeleitet.
                                    </p>
                                    <div class="rounded-lg border border-primary/30 bg-primary/5 p-3 text-sm text-muted-foreground">
                                        <p>
                                            Der Betrag wird nur einmalig fällig, es entstehen keine weiteren Kosten und es ist keine Kündigung notwendig.
                                            <strong class="text-foreground"> Eine Auszahlung von aufgeladenem Guthaben ist ausgeschlossen</strong>
                                            (§ 312g Abs. 2 Nr. 1 BGB). Mit der Aufladung stimmen Sie den AGB zu.
                                        </p>
                                    </div>
                                    <Button
                                        class="w-full gap-2"
                                        :disabled="balanceTopUpSubmitting || summaryAmount < balanceTopUpMin"
                                        @click="submitBalanceTopUp"
                                    >
                                        <Lock class="h-4 w-4" />
                                        <span>{{ balanceTopUpSubmitting ? 'Weiterleitung…' : 'Jetzt sicher aufladen' }}</span>
                                        <ArrowRight class="h-4 w-4" />
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>

                        <!-- Sidebar: Zusammenfassung -->
                        <Card class="h-fit lg:sticky lg:top-4">
                            <CardHeader class="pb-2">
                                <CardTitle class="flex items-center gap-2 text-base font-semibold">
                                    <Receipt class="h-5 w-5 text-primary" />
                                    Zusammenfassung
                                </CardTitle>
                            </CardHeader>
                            <CardContent class="space-y-4">
                                <div class="flex justify-between text-sm">
                                    <span class="text-muted-foreground">Aufladebetrag</span>
                                    <span class="font-semibold">{{ summaryFormatted }} €</span>
                                </div>
                                <hr class="border-border" />
                                <div class="flex justify-between text-sm font-medium">
                                    <span class="text-muted-foreground">Gutgeschrieben</span>
                                    <span class="text-lg">{{ summaryFormatted }} €</span>
                                </div>
                                <ul class="space-y-2 pt-2 text-xs text-muted-foreground">
                                    <li class="flex items-start gap-2">
                                        <Shield class="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                                        <span>Sichere Zahlung mit SSL-Verschlüsselung</span>
                                    </li>
                                    <li class="flex items-start gap-2">
                                        <Zap class="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                                        <span>Sofortige Gutschrift bei den meisten Zahlarten</span>
                                    </li>
                                    <li class="flex items-start gap-2">
                                        <Ban class="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                                        <span>Einmalig — kein Abo, keine versteckten Kosten</span>
                                    </li>
                                    <li class="flex items-start gap-2">
                                        <Headset class="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                                        <span>Support bei Problemen rund um die Uhr</span>
                                    </li>
                                </ul>
                            </CardContent>
                        </Card>
                    </div>
                </CardContent>
            </Card>

            <!-- AI Tokens (nur wenn für diese Marke aktiviert) -->
            <Card v-if="props.aiTokensEnabled && props.aiTokenPackages?.length">
                <CardHeader>
                    <CardTitle class="flex items-center gap-2">
                        <Sparkles class="h-5 w-5" />
                        AI Tokens
                    </CardTitle>
                    <CardDescription>
                        Aktueller Stand: {{ props.aiTokenBalance }} Tokens. Für KI-SEO und KI-Author im Page Designer.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div class="flex flex-wrap gap-2">
                        <Button
                            v-for="pkg in props.aiTokenPackages"
                            :key="pkg.amount"
                            variant="outline"
                            size="sm"
                            @click="checkoutAiTokens(pkg.amount)"
                        >
                            {{ pkg.label }}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <!-- Zahlungsart -->
            <Card>
                <CardHeader>
                    <CardTitle>Zahlungsart</CardTitle>
                    <CardDescription>
                        Verwalten Sie Ihre Zahlungsmethode und Abrechnungen
                    </CardDescription>
                    <div class="mt-2 flex flex-wrap gap-2">
                        <div
                            v-for="method in molliePaymentMethods"
                            :key="method.type"
                            class="flex items-center gap-2 rounded-md border bg-muted/30 px-3 py-1.5"
                        >
                            <PaymentMethodLogo :type="method.type" :size="18" />
                            <span class="text-xs">{{ method.label }}</span>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <p v-if="paymentMethodSummary" class="text-sm">
                        Aktuelle Zahlungsmethode:
                        <strong>{{ paymentMethodSummary.brand }} ****{{ paymentMethodSummary.last4 }}</strong>
                    </p>
                    <p v-else class="text-sm text-muted">
                        Noch keine Zahlungsmethode hinterlegt (wird beim ersten Abo-Abschluss angelegt).
                    </p>
                    <a
                        :href="billingPortalUrl"
                        class="mt-3 inline-block"
                        target="_self"
                        rel="noopener"
                    >
                        <Button variant="outline" size="sm">
                            Zahlungsart verwalten
                            <ExternalLink class="ml-2 h-3 w-3" />
                        </Button>
                    </a>
                </CardContent>
            </Card>
        </div>
    </AppLayout>
</template>
