<script setup lang="ts">
import { Form, Head, Link, usePage } from '@inertiajs/vue3';
import { watch, ref, computed } from 'vue';
import DiscountCodeBlock from '@/components/checkout/DiscountCodeBlock.vue';
import InputError from '@/components/InputError.vue';
import PaymentMethodLogo from '@/components/PaymentMethodLogo.vue';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Heading, Text } from '@/components/ui/typography';
import { notify } from '@/composables/useNotify';
import AppLayout from '@/layouts/AppLayout.vue';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';

type HostingPlan = {
    id: number;
    name: string;
    disk_gb: number;
    traffic_gb: number;
    domains: number;
    subdomains: number;
    mailboxes: number;
    databases: number;
    price: string;
};

type Props = {
    hostingPlans: HostingPlan[];
    selectedPlan: HostingPlan | null;
    canPayWithBalance?: boolean;
    customerBalance?: number;
    amountRequired?: number;
    tosUrl?: string;
    privacyUrl?: string;
};

const props = defineProps<Props>();

const paymentMethod = ref<'mollie' | 'balance'>('mollie');
const selectedPlanId = ref<string>(props.selectedPlan ? String(props.selectedPlan.id) : '');
const periodMonths = ref<number>(1);
const acceptTos = ref(false);
const acceptEarlyExecution = ref(false);

const currentPlan = computed((): HostingPlan | null => {
    const id = Number(selectedPlanId.value);
    if (!id) return null;
    return props.hostingPlans.find((p) => p.id === id) ?? null;
});

const basePrice = computed(() => (currentPlan.value ? Number(currentPlan.value.price) : 0));
const totalAmount = computed(() => round2(basePrice.value * periodMonths.value));

const effectiveTotal = ref(0);
watch(totalAmount, (v) => {
    effectiveTotal.value = v;
}, { immediate: true });

function round2(n: number): number {
    return Math.round(n * 100) / 100;
}

const PERIOD_OPTIONS = [1, 3, 6] as const;

const canSubmitWithBalance = computed(
    () =>
        Boolean(props.canPayWithBalance && (props.customerBalance ?? 0) >= effectiveTotal.value),
);

const canSubmit = computed(
    () => Boolean(acceptTos.value && acceptEarlyExecution.value && currentPlan.value),
);

const page = usePage();
const molliePaymentMethods = computed(
    () =>
        (page.props.molliePaymentMethods as { type: string; label: string }[]) ?? [
            { type: 'card', label: 'Karte' },
            { type: 'paypal', label: 'PayPal' },
            { type: 'sepa_debit', label: 'SEPA-Lastschrift' },
        ],
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
    { title: 'Webspace', href: '/webspace' },
    { title: 'Checkout', href: '#' },
];
</script>

<template>
    <AppLayout :breadcrumbs="breadcrumbs">
        <Head title="Webspace buchen" />

        <div class="w-full space-y-8">
            <div>
                <Heading level="h1">Webspace buchen</Heading>
                <Text class="mt-2" muted>
                    Domain angeben, Paket und Laufzeit wählen
                </Text>
            </div>

            <Form
                action="/webspace/checkout"
                method="post"
                class="block"
                v-slot="{ errors, processing }"
            >
                <div class="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:items-stretch">
                    <div class="space-y-6 lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle class="text-lg">Bestellübersicht</CardTitle>
                                <CardDescription>Hauptdomain und Paket</CardDescription>
                            </CardHeader>
                            <CardContent class="space-y-4">
                                <div class="space-y-2">
                                    <Label for="domain">Domain *</Label>
                                    <Input
                                        id="domain"
                                        name="domain"
                                        type="text"
                                        required
                                        placeholder="beispiel.de"
                                        :aria-invalid="!!errors.domain"
                                    />
                                    <InputError :message="errors.domain" />
                                </div>
                                <div class="space-y-2">
                                    <Label for="hosting_plan_id">Paket *</Label>
                                    <select
                                        id="hosting_plan_id"
                                        name="hosting_plan_id"
                                        v-model="selectedPlanId"
                                        required
                                        class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                        :aria-invalid="!!errors.hosting_plan_id"
                                    >
                                        <option value="">Bitte wählen</option>
                                        <option
                                            v-for="plan in props.hostingPlans"
                                            :key="plan.id"
                                            :value="plan.id"
                                        >
                                            {{ plan.name }} – {{ plan.price }} €/Monat ({{ plan.disk_gb }} GB / {{ plan.traffic_gb }} GB Traffic)
                                        </option>
                                    </select>
                                    <InputError :message="errors.hosting_plan_id" />
                                </div>
                                <div class="space-y-2">
                                    <Label for="period_months">Laufzeit *</Label>
                                    <select
                                        id="period_months"
                                        name="period_months"
                                        v-model.number="periodMonths"
                                        required
                                        class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                        :aria-invalid="!!errors.period_months"
                                    >
                                        <option
                                            v-for="m in PERIOD_OPTIONS"
                                            :key="m"
                                            :value="m"
                                        >
                                            {{ m }} Monat(e) – {{ (basePrice * m).toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }} €
                                        </option>
                                    </select>
                                    <InputError :message="errors.period_months" />
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle class="text-lg">Rechtliches</CardTitle>
                                <CardDescription>Bitte bestätigen Sie die folgenden Punkte.</CardDescription>
                            </CardHeader>
                            <CardContent class="space-y-4">
                                <label class="flex cursor-pointer items-start gap-3">
                                    <input
                                        v-model="acceptTos"
                                        type="checkbox"
                                        name="accept_tos"
                                        value="1"
                                        class="mt-1 h-4 w-4 rounded border-input"
                                        :aria-invalid="!!errors.accept_tos"
                                    />
                                    <span class="text-sm">
                                        Ich habe die
                                        <a
                                            :href="props.tosUrl ?? '#'"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            class="underline hover:no-underline"
                                        >allgemeinen Geschäftsbedingungen</a>
                                        und
                                        <a
                                            :href="props.privacyUrl ?? '#'"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            class="underline hover:no-underline"
                                        >Datenschutzerklärung</a>
                                        gelesen und akzeptiere diese.
                                    </span>
                                </label>
                                <InputError :message="errors.accept_tos" />
                                <label class="flex cursor-pointer items-start gap-3">
                                    <input
                                        v-model="acceptEarlyExecution"
                                        type="checkbox"
                                        name="accept_early_execution"
                                        value="1"
                                        class="mt-1 h-4 w-4 rounded border-input"
                                        :aria-invalid="!!errors.accept_early_execution"
                                    />
                                    <span class="text-sm">
                                        Ich wünsche die vollständige Ausführung der Dienstleistung vor Fristablauf des Widerrufsrechts gemäß Fernabsatzgesetz. Die automatische Einrichtung und Erbringung der Dienstleistung führt zum Erlöschen des Widerrufsrechts.
                                    </span>
                                </label>
                                <InputError :message="errors.accept_early_execution" />
                            </CardContent>
                        </Card>
                    </div>

                    <div class="lg:contents">
                        <Card class="flex flex-col border-2 border-primary/20 bg-primary/5 lg:sticky lg:top-6">
                            <CardHeader>
                                <CardTitle class="text-lg">Kostenübersicht</CardTitle>
                                <CardDescription v-if="currentPlan">
                                    {{ currentPlan.name }} · {{ periodMonths }} Monat(e)
                                </CardDescription>
                                <CardDescription v-else>
                                    Paket wählen
                                </CardDescription>
                            </CardHeader>
                            <CardContent class="flex flex-1 flex-col space-y-4">
                                <template v-if="currentPlan">
                                    <div class="space-y-2 text-sm">
                                        <div class="flex justify-between">
                                            <span class="text-muted-foreground">Paket</span>
                                            <span class="tabular-nums">{{ basePrice.toLocaleString('de-DE', { minimumFractionDigits: 2 }) }} €/Monat</span>
                                        </div>
                                        <div class="flex justify-between">
                                            <span class="text-muted-foreground">Laufzeit</span>
                                            <span>{{ periodMonths }} Monat(e)</span>
                                        </div>
                                        <DiscountCodeBlock
                                            :total-amount="totalAmount"
                                            :period-months="periodMonths"
                                            @update:effective-total="effectiveTotal = $event"
                                        />
                                        <div class="border-t pt-3 text-base font-semibold">
                                            <div class="flex justify-between">
                                                <span>Heute fällig</span>
                                                <span class="tabular-nums">{{ effectiveTotal.toLocaleString('de-DE', { minimumFractionDigits: 2 }) }} €</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div v-if="props.canPayWithBalance" class="mt-auto space-y-2 border-t pt-4">
                                        <p class="text-sm font-medium">Zahlungsart</p>
                                        <label class="flex cursor-pointer flex-col gap-2 rounded-lg border p-3 transition-colors hover:bg-muted/50 has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                                            <div class="flex items-center gap-2">
                                                <input v-model="paymentMethod" type="radio" name="payment_method" value="mollie" class="h-4 w-4 border-input text-primary" />
                                                <span class="text-sm font-medium">Karte, PayPal, SEPA, …</span>
                                            </div>
                                            <div class="flex flex-wrap gap-2 pl-6">
                                                <div
                                                    v-for="method in molliePaymentMethods"
                                                    :key="method.type"
                                                    class="flex items-center gap-2 rounded-md border bg-muted/30 px-3 py-2"
                                                >
                                                    <PaymentMethodLogo :type="method.type" :size="20" />
                                                    <span class="text-sm">{{ method.label }}</span>
                                                </div>
                                            </div>
                                        </label>
                                        <label
                                            class="flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50 has-[:checked]:border-primary has-[:checked]:bg-primary/5"
                                            :class="{ 'opacity-60': !canSubmitWithBalance }"
                                        >
                                            <input
                                                v-model="paymentMethod"
                                                type="radio"
                                                name="payment_method"
                                                value="balance"
                                                :disabled="!canSubmitWithBalance"
                                                class="h-4 w-4 border-input text-primary"
                                            />
                                            <span class="text-sm">Mit Guthaben bezahlen (Aktuell {{ (props.customerBalance ?? 0).toLocaleString('de-DE', { minimumFractionDigits: 2 }) }} €)</span>
                                        </label>
                                    </div>
                                    <div v-else class="mt-auto space-y-2 border-t pt-4">
                                        <p class="text-sm font-medium">Zahlungsart</p>
                                        <div class="flex flex-wrap gap-2">
                                            <div
                                                v-for="method in molliePaymentMethods"
                                                :key="method.type"
                                                class="flex items-center gap-2 rounded-md border bg-muted/30 px-3 py-2"
                                            >
                                                <PaymentMethodLogo :type="method.type" :size="20" />
                                                <span class="text-sm">{{ method.label }}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="mt-auto flex flex-col gap-2">
                                        <Button
                                            type="submit"
                                            class="w-full"
                                            size="lg"
                                            :disabled="processing || !canSubmit"
                                        >
                                            {{ processing ? 'Wird weitergeleitet…' : (paymentMethod === 'balance' && canSubmitWithBalance ? 'Mit Guthaben bezahlen' : 'Kostenpflichtig bestellen') }}
                                        </Button>
                                        <Link href="/webspace" class="block">
                                            <Button type="button" variant="outline" class="w-full">Abbrechen</Button>
                                        </Link>
                                    </div>
                                </template>
                                <template v-else>
                                    <p class="text-sm text-muted-foreground">Bitte wählen Sie links ein Paket aus.</p>
                                    <div class="mt-auto flex flex-col gap-2">
                                        <Button type="submit" class="w-full" size="lg" disabled>Paket wählen</Button>
                                        <Link href="/webspace" class="block">
                                            <Button type="button" variant="outline" class="w-full">Abbrechen</Button>
                                        </Link>
                                    </div>
                                </template>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </Form>
        </div>
    </AppLayout>
</template>
