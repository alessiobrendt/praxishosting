<script setup lang="ts">
import { Form, Head, Link, usePage } from '@inertiajs/vue3';
import { Wallet, Headphones } from 'lucide-vue-next';
import { watch, ref, computed } from 'vue';
import DiscountCodeBlock from '@/components/checkout/DiscountCodeBlock.vue';
import InputError from '@/components/InputError.vue';
import PaymentMethodLogo from '@/components/PaymentMethodLogo.vue';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Heading, Text } from '@/components/ui/typography';
import { notify } from '@/composables/useNotify';
import AppLayout from '@/layouts/AppLayout.vue';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';

type PlanOptionChoice = { value: string; label: string; price_delta?: number };

type PlanOption = {
    id: string;
    name: string;
    type: 'free' | 'choice' | 'text' | 'range_slider' | 'select';
    price_per_unit: number;
    sort_order: number;
    choices?: PlanOptionChoice[];
    min?: number;
    max?: number;
    step?: number;
    unit?: string;
    placeholder?: string;
    max_length?: number;
};

type HostingPlan = {
    id: number;
    name: string;
    price: string;
    config?: { plan_options?: PlanOption[]; [k: string]: unknown };
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

const periodMonths = ref<number>(1);
const acceptTos = ref(false);
const acceptEarlyExecution = ref(false);

const PERIOD_OPTIONS = [1, 3, 6] as const;

const page = usePage();
const molliePaymentMethods = computed(
    () =>
        (page.props.molliePaymentMethods as { type: string; label: string }[]) ?? [
            { type: 'card', label: 'Karte' },
            { type: 'paypal', label: 'PayPal' },
            { type: 'sepa_debit', label: 'SEPA-Lastschrift' },
        ],
);

const paymentMethod = ref<'mollie' | 'balance'>('mollie');
const selectedPlanId = ref<string>(String(props.selectedPlan?.id ?? ''));
const optionChoices = ref<Record<string, string | number>>({});

const currentPlan = computed((): HostingPlan | null => {
    const id = Number(selectedPlanId.value);
    if (!id) return null;
    return props.hostingPlans.find((p) => p.id === id) ?? null;
});

const planOptions = computed((): PlanOption[] => {
    const opts = currentPlan.value?.config?.plan_options;
    if (!Array.isArray(opts)) return [];
    return [...opts].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
});

function optionSurcharge(opt: PlanOption, value: string | number | undefined): number {
    if (opt.type === 'free') return 0;
    if (value === undefined || value === '') return 0;
    if (opt.type === 'choice' || opt.type === 'select') {
        const choice = opt.choices?.find((c) => String(c.value) === String(value));
        return Number(choice?.price_delta ?? 0);
    }
    if (opt.type === 'range_slider') {
        const num = Number(value);
        if (opt.id === 'slots' && num >= 0) {
            return Number(opt.price_per_unit ?? 0) * num;
        }
        const min = Number(opt.min ?? 0);
        const step = Number(opt.step ?? 1);
        if (step <= 0) return 0;
        return Number(opt.price_per_unit ?? 0) * ((num - min) / step);
    }
    if (opt.type === 'text') return Number(opt.price_per_unit ?? 0);
    return 0;
}

const totalOptionSurcharge = computed(() => {
    let sum = 0;
    for (const opt of planOptions.value) {
        sum += optionSurcharge(opt, optionChoices.value[opt.id]);
    }
    return sum;
});

const optionSurchargeItems = computed(() => {
    const items: { name: string; surcharge: number }[] = [];
    for (const opt of planOptions.value) {
        const value = optionChoices.value[opt.id];
        if (value === undefined || value === '') continue;
        const surcharge = optionSurcharge(opt, value);
        items.push({ name: opt.name, surcharge });
    }
    return items;
});

const basePrice = computed(() => Number(currentPlan.value?.price ?? 0));
const monthlyTotal = computed(() => basePrice.value + totalOptionSurcharge.value);
const totalAmount = computed(() => Math.round(monthlyTotal.value * periodMonths.value * 100) / 100);

const effectiveTotal = ref(0);
watch(totalAmount, (v) => {
    effectiveTotal.value = v;
}, { immediate: true });

const isPricePerSlotOnly = computed(() => basePrice.value === 0 && currentPlan.value != null);

const canSubmit = computed(
    () => Boolean(acceptTos.value && acceptEarlyExecution.value && currentPlan.value),
);

function planPriceLabel(plan: HostingPlan): string {
    const p = Number(plan.price ?? 0);
    if (p > 0) return `${plan.price} €/Monat`;
    const opts = plan.config?.plan_options ?? [];
    const slotsOpt = opts.find((o) => o.id === 'slots');
    const slotPrice = slotsOpt?.price_per_unit ?? 0;
    if (slotPrice > 0) return `ab ${slotPrice.toLocaleString('de-DE', { minimumFractionDigits: 2 })} € pro Slot`;
    return 'Preis pro Slot';
}

const canSubmitWithBalance = computed(() =>
    Boolean(props.canPayWithBalance && (props.customerBalance ?? 0) >= effectiveTotal.value),
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

watch(
    () => selectedPlanId.value,
    (planId) => {
        if (!planId) {
            optionChoices.value = {};
            return;
        }
        const plan = props.hostingPlans.find((p) => String(p.id) === planId) ?? null;
        if (!plan) return;
        const next: Record<string, string | number> = {};
        const opts = plan.config?.plan_options ?? [];
        for (const opt of opts) {
            const existing = optionChoices.value[opt.id];
            if (existing !== undefined) {
                next[opt.id] = existing;
            } else if (opt.type === 'range_slider') {
                const minVal = opt.min;
                next[opt.id] = minVal != null && minVal !== '' ? Number(minVal) : 0;
            } else if (opt.type === 'choice' || opt.type === 'select') {
                const first = opt.choices?.[0];
                if (first) next[opt.id] = first.value;
            }
        }
        optionChoices.value = next;
    },
    { immediate: true },
);

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'TeamSpeak Server', href: '/teamspeak' },
    { title: 'Checkout', href: '#' },
];
</script>

<template>
    <AppLayout :breadcrumbs="breadcrumbs">
        <Head title="TeamSpeak Server buchen" />

        <div class="w-full space-y-8">
            <div class="flex items-center gap-3">
                <div>
                    <Heading level="h1" class="tracking-tight">TeamSpeak Server buchen</Heading>
                    <Text class="mt-1" muted>
                        Paket wählen, Slots anpassen und zur Kasse
                    </Text>
                </div>
            </div>

            <Form
                action="/teamspeak/checkout"
                method="post"
                class="block"
                v-slot="{ errors, processing }"
            >
                <div class="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:items-stretch">
                    <Card class="flex flex-col lg:col-span-2 lg:h-full lg:min-h-0">
                        <CardHeader>
                            <CardTitle class="flex items-center gap-2 text-lg">
                                <Headphones class="h-5 w-5" />
                                Paket & Optionen
                            </CardTitle>
                            <CardDescription>Wählen Sie Ihr TeamSpeak-Paket und passen Sie die Slots an.</CardDescription>
                        </CardHeader>
                        <CardContent class="flex flex-1 flex-col space-y-5">
                            <div class="space-y-2">
                                <Label for="hosting_plan_id">Paket *</Label>
                                <Select
                                    id="hosting_plan_id"
                                    name="hosting_plan_id"
                                    v-model="selectedPlanId"
                                    required
                                    :aria-invalid="!!errors.hosting_plan_id"
                                >
                                    <option value="">Bitte wählen</option>
                                    <option
                                        v-for="plan in props.hostingPlans"
                                        :key="plan.id"
                                        :value="String(plan.id)"
                                    >
                                        {{ plan.name }} – {{ planPriceLabel(plan) }}
                                    </option>
                                </Select>
                                <InputError :message="errors.hosting_plan_id" />
                            </div>

                            <template v-if="planOptions.length > 0 && currentPlan">
                                <div class="space-y-4 rounded-lg border bg-muted/30 p-5">
                                    <h3 class="font-semibold">Paket-Optionen</h3>
                                    <div class="grid gap-4 sm:grid-cols-2">
                                        <div
                                            v-for="opt in planOptions"
                                            :key="opt.id"
                                            class="space-y-2"
                                            :class="opt.type === 'range_slider' ? 'sm:col-span-2' : ''"
                                        >
                                            <Label class="text-sm font-medium">{{ opt.name }}</Label>
                                            <template v-if="opt.type === 'free'">
                                                <label class="flex items-center gap-2">
                                                    <input
                                                        type="checkbox"
                                                        :name="`option_choices[${opt.id}]`"
                                                        value="1"
                                                        :checked="optionChoices[opt.id] !== undefined && optionChoices[opt.id] !== ''"
                                                        class="h-4 w-4 rounded border-input"
                                                        @change="if (($event.target as HTMLInputElement).checked) { optionChoices[opt.id] = '1'; } else { delete optionChoices[opt.id]; }"
                                                    />
                                                    <span class="text-sm">Inklusive</span>
                                                </label>
                                            </template>
                                            <template v-else-if="opt.type === 'choice' || opt.type === 'select'">
                                                <Select
                                                    :model-value="String(optionChoices[opt.id] ?? '')"
                                                    class="h-10"
                                                    :name="`option_choices[${opt.id}]`"
                                                    @update:model-value="(v) => { optionChoices[opt.id] = v; }"
                                                >
                                                    <option value="">Bitte wählen</option>
                                                    <option
                                                        v-for="ch in (opt.choices ?? [])"
                                                        :key="ch.value"
                                                        :value="ch.value"
                                                    >
                                                        {{ ch.label }}
                                                        <template v-if="(ch.price_delta ?? 0) > 0">
                                                            (+ {{ Number(ch.price_delta).toLocaleString('de-DE', { minimumFractionDigits: 2 }) }} €)
                                                        </template>
                                                    </option>
                                                </Select>
                                            </template>
                                            <template v-else-if="opt.type === 'text'">
                                                <Input
                                                    :model-value="String(optionChoices[opt.id] ?? '')"
                                                    class="h-10"
                                                    :placeholder="opt.placeholder"
                                                    :maxlength="opt.max_length"
                                                    :name="`option_choices[${opt.id}]`"
                                                    @update:model-value="(v) => { optionChoices[opt.id] = v || ''; }"
                                                />
                                            </template>
                                            <template v-else-if="opt.type === 'range_slider'">
                                                <div class="flex items-center gap-3">
                                                    <input
                                                        type="range"
                                                        :min="opt.min ?? 0"
                                                        :max="opt.max ?? 100"
                                                        :step="opt.step ?? 1"
                                                        :value="Number(optionChoices[opt.id] ?? opt.min ?? 0)"
                                                        class="h-2 flex-1 accent-primary"
                                                        @input="optionChoices[opt.id] = Number(($event.target as HTMLInputElement).value)"
                                                    />
                                                    <input
                                                        type="hidden"
                                                        :name="`option_choices[${opt.id}]`"
                                                        :value="optionChoices[opt.id] ?? opt.min ?? 0"
                                                    />
                                                    <span class="min-w-[4rem] text-right text-sm tabular-nums">
                                                        {{ optionChoices[opt.id] ?? opt.min ?? 0 }} {{ opt.unit ?? '' }}
                                                    </span>
                                                </div>
                                            </template>
                                        </div>
                                    </div>
                                </div>
                            </template>

                            <div class="space-y-2">
                                <Label for="period_months">Laufzeit *</Label>
                                <select
                                    id="period_months"
                                    name="period_months"
                                    v-model.number="periodMonths"
                                    required
                                    class="flex h-11 w-full rounded-lg border border-input bg-background px-4 py-2 text-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                    :aria-invalid="!!errors.period_months"
                                >
                                    <option
                                        v-for="m in PERIOD_OPTIONS"
                                        :key="m"
                                        :value="m"
                                    >
                                        {{ m }} Monat(e) – {{ (monthlyTotal * m).toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }} €
                                    </option>
                                </select>
                                <InputError :message="errors.period_months" />
                            </div>
                            <div class="space-y-2">
                                <Label for="server_name">Server-Name (optional)</Label>
                                <Input
                                    id="server_name"
                                    name="server_name"
                                    type="text"
                                    class="h-11"
                                    placeholder="z. B. Mein TeamSpeak"
                                    :aria-invalid="!!errors.server_name"
                                />
                                <InputError :message="errors.server_name" />
                            </div>
                            <div class="space-y-4 rounded-lg border bg-muted/30 p-4">
                                <h3 class="font-semibold">Rechtliches</h3>
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
                                        <a :href="props.tosUrl ?? '#'" target="_blank" rel="noopener noreferrer" class="underline hover:no-underline">allgemeinen Geschäftsbedingungen</a>
                                        und
                                        <a :href="props.privacyUrl ?? '#'" target="_blank" rel="noopener noreferrer" class="underline hover:no-underline">Datenschutzerklärung</a>
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
                            </div>
                        </CardContent>
                    </Card>

                    <div class="lg:contents">
                        <Card class="flex flex-col border-2 border-primary/20 bg-primary/5 lg:h-full lg:min-h-0 lg:sticky lg:top-6">
                            <CardHeader>
                                <CardTitle class="text-lg">Zusammenfassung</CardTitle>
                                <CardDescription v-if="currentPlan">
                                    {{ currentPlan.name }}
                                </CardDescription>
                                <CardDescription v-else>
                                    Wählen Sie ein Paket
                                </CardDescription>
                            </CardHeader>
                            <CardContent class="flex flex-1 flex-col space-y-4">
                                <template v-if="currentPlan">
                                    <div class="space-y-2 text-sm">
                                        <div class="flex justify-between">
                                            <span class="text-muted-foreground">Basis-Preis</span>
                                            <span v-if="!isPricePerSlotOnly" class="tabular-nums">{{ basePrice.toLocaleString('de-DE', { minimumFractionDigits: 2 }) }} €/Monat</span>
                                            <span v-else class="text-muted-foreground">– (nur pro Slot)</span>
                                        </div>
                                        <template v-for="item in optionSurchargeItems" :key="item.name">
                                            <div class="flex justify-between">
                                                <span class="text-muted-foreground">{{ item.name }}</span>
                                                <span class="tabular-nums">
                                                    {{ item.surcharge > 0 ? `+ ${item.surcharge.toLocaleString('de-DE', { minimumFractionDigits: 2 })} €` : 'inkl.' }}
                                                </span>
                                            </div>
                                        </template>
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
                                            <div class="flex min-w-0 flex-1 items-center gap-2">
                                                <Wallet class="h-4 w-4 shrink-0 text-muted-foreground" />
                                                <span class="text-sm">Mit Guthaben bezahlen</span>
                                                <span v-if="canSubmitWithBalance" class="truncate text-xs text-muted-foreground">
                                                    (Aktuell {{ (props.customerBalance ?? 0).toLocaleString('de-DE', { minimumFractionDigits: 2 }) }} €)
                                                </span>
                                                <span v-else class="text-xs text-destructive">(nicht ausreichend)</span>
                                            </div>
                                        </label>
                                    </div>
                                    <div class="mt-auto flex flex-col gap-2">
                                        <Button type="submit" class="w-full" size="lg" :disabled="processing || !canSubmit">
                                            {{ processing ? 'Wird weitergeleitet…' : (paymentMethod === 'balance' && canSubmitWithBalance ? 'Mit Guthaben bezahlen' : 'Kostenpflichtig bestellen') }}
                                        </Button>
                                        <Link href="/teamspeak" class="block">
                                            <Button type="button" variant="outline" class="w-full">Abbrechen</Button>
                                        </Link>
                                    </div>
                                </template>
                                <template v-else>
                                    <p class="text-sm text-muted-foreground">Bitte wählen Sie links ein Paket aus.</p>
                                    <div class="mt-auto flex flex-col gap-2">
                                        <Button type="submit" class="w-full" size="lg" disabled>Paket wählen</Button>
                                        <Link href="/teamspeak" class="block">
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
