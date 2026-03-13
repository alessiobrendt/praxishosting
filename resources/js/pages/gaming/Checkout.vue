<script setup lang="ts">
import { Form, Head, Link, usePage } from '@inertiajs/vue3';
import { Wallet, Server } from 'lucide-vue-next';
import { watch, ref, computed } from 'vue';
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
    source?: 'pterodactyl_nests' | 'pterodactyl_eggs';
    placeholder?: string;
    max_length?: number;
};

type HostingPlan = {
    id: number;
    name: string;
    price: string;
    config?: {
        memory?: number;
        disk?: number;
        cpu?: number;
        nest_id?: number;
        egg_id?: number;
        plan_options?: PlanOption[];
        [k: string]: unknown;
    };
};

type Props = {
    hostingPlans: HostingPlan[];
    selectedPlan: HostingPlan | null;
    canPayWithBalance?: boolean;
    customerBalance?: number;
    amountRequired?: number;
    pterodactylEggs?: { id: number; name: string }[];
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

const discountCodeInput = ref('');
const appliedDiscount = ref<{ discount_amount: number; final_amount: number; code: string } | null>(null);
const discountCodeError = ref('');
const discountCodeValidating = ref(false);

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

/** Pro Option: Name + Aufpreis für die Zusammenfassung (nur Optionen mit gewähltem Wert) */
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

const effectiveTotal = computed(() =>
    appliedDiscount.value ? appliedDiscount.value.final_amount : totalAmount.value,
);

const canSubmitWithBalance = computed(() =>
    Boolean(props.canPayWithBalance && (props.customerBalance ?? 0) >= effectiveTotal.value),
);

function getCsrfToken(): string {
    const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
    if (match) return decodeURIComponent(match[1]);
    const meta = document.querySelector('meta[name="csrf-token"]');
    return (meta && (meta as HTMLMetaElement).content) || '';
}

async function applyDiscountCode(): Promise<void> {
    const code = discountCodeInput.value.trim();
    if (!code) {
        discountCodeError.value = 'Bitte Code eingeben.';
        return;
    }
    discountCodeError.value = '';
    discountCodeValidating.value = true;
    try {
        const res = await fetch('/discount-code/validate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'X-XSRF-TOKEN': getCsrfToken(),
                'X-Requested-With': 'XMLHttpRequest',
            },
            body: JSON.stringify({
                code,
                amount: totalAmount.value,
                period_months: periodMonths.value,
            }),
        });
        const data = await res.json();
        if (data.valid && data.final_amount !== undefined) {
            appliedDiscount.value = {
                discount_amount: data.discount_amount,
                final_amount: data.final_amount,
                code: data.code ?? code,
            };
        } else {
            appliedDiscount.value = null;
            discountCodeError.value = data.message ?? 'Rabattcode ungültig.';
        }
    } catch {
        discountCodeError.value = 'Prüfung fehlgeschlagen. Bitte erneut versuchen.';
        appliedDiscount.value = null;
    } finally {
        discountCodeValidating.value = false;
    }
}

function clearDiscountCode(): void {
    discountCodeInput.value = '';
    appliedDiscount.value = null;
    discountCodeError.value = '';
}

const canSubmit = computed(
    () => Boolean(acceptTos.value && acceptEarlyExecution.value && currentPlan.value),
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
            } else if (opt.type === 'range_slider' && typeof opt.min === 'number') {
                next[opt.id] = opt.min;
            } else if (opt.type === 'choice' || opt.type === 'select') {
                const first = opt.choices?.[0];
                if (first) next[opt.id] = first.value;
            }
        }
        optionChoices.value = next;
    },
    { immediate: true },
);

const dynamicNests = ref<{ id: number; name: string }[]>([]);
watch(
    () => props.selectedPlan?.id,
    async (planId) => {
        if (!planId) {
            dynamicNests.value = [];
            return;
        }
        const hasNestOption = planOptions.value.some((o) => o.source === 'pterodactyl_nests');
        if (!hasNestOption) {
            dynamicNests.value = [];
            return;
        }
        try {
            const url = new URL('/gaming/checkout/pterodactyl-nests', window.location.origin);
            url.searchParams.set('hosting_plan_id', String(planId));
            const res = await fetch(url.toString());
            if (!res.ok) return;
            const data = await res.json();
            dynamicNests.value = Array.isArray(data.nests) ? data.nests : [];
        } catch {
            dynamicNests.value = [];
        }
    },
    { immediate: true },
);

const dynamicEggs = ref<{ id: number; name: string }[]>([]);
watch(
    () => [selectedPlanId.value, optionChoices.value['nest_id']] as const,
    async ([planId, nestId]) => {
        if (!planId || nestId === undefined || nestId === '') {
            dynamicEggs.value = [];
            return;
        }
        try {
            const url = new URL('/gaming/checkout/pterodactyl-eggs', window.location.origin);
            url.searchParams.set('hosting_plan_id', String(planId));
            url.searchParams.set('nest_id', String(nestId));
            const res = await fetch(url.toString());
            if (!res.ok) return;
            const data = await res.json();
            dynamicEggs.value = Array.isArray(data.eggs) ? data.eggs : [];
        } catch {
            dynamicEggs.value = [];
        }
    },
    { immediate: true },
);

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Game Server', href: '/gaming' },
    { title: 'Checkout', href: '#' },
];
</script>

<template>
    <AppLayout :breadcrumbs="breadcrumbs">
        <Head title="Game Server buchen" />

        <div class="w-full space-y-8">
            <div class="flex items-center gap-3">
         
                <div>
                    <Heading level="h1" class="tracking-tight">Game Server buchen</Heading>
                    <Text class="mt-1" muted>
                        Paket wählen, Optionen anpassen und zur Kasse
                    </Text>
                </div>
            </div>

            <Form
                action="/gaming/checkout"
                method="post"
                class="block"
                v-slot="{ errors, processing }"
            >
                <div class="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:items-stretch">
                    <Card class="flex flex-col lg:col-span-2 lg:h-full lg:min-h-0">
                        <CardHeader>
                                <CardTitle class="flex items-center gap-2 text-lg">
                                    <Server class="h-5 w-5" />
                                    Paket & Optionen
                                </CardTitle>
                                <CardDescription>Wählen Sie Ihr Game-Server-Paket und passen Sie optionale Erweiterungen an.</CardDescription>
                            </CardHeader>
                            <CardContent class="flex flex-1 flex-col space-y-5">
                                <div class="space-y-2">
                                    <Label for="hosting_plan_id">Paket *</Label>
                                    <select
                                        id="hosting_plan_id"
                                        name="hosting_plan_id"
                                        v-model="selectedPlanId"
                                        required
                                        class="flex h-11 w-full rounded-lg border border-input bg-background px-4 py-2 text-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                        :aria-invalid="!!errors.hosting_plan_id"
                                    >
                                        <option value="">Bitte wählen</option>
                                        <option
                                            v-for="plan in props.hostingPlans"
                                            :key="plan.id"
                                            :value="String(plan.id)"
                                        >
                                            {{ plan.name }} – {{ plan.price }} €/Monat
                                        </option>
                                    </select>
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
                                                <template v-else-if="opt.type === 'choice' || (opt.type === 'select' && !opt.source)">
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
                                                <template v-else-if="opt.type === 'select' && opt.source === 'pterodactyl_nests'">
                                                    <Select
                                                        :model-value="String(optionChoices[opt.id] ?? '')"
                                                        class="h-10"
                                                        :name="`option_choices[${opt.id}]`"
                                                        @update:model-value="(v) => { optionChoices[opt.id] = v; }"
                                                    >
                                                        <option value="">Bitte wählen</option>
                                                        <option
                                                            v-for="n in dynamicNests"
                                                            :key="n.id"
                                                            :value="String(n.id)"
                                                        >
                                                            {{ n.name }}
                                                        </option>
                                                    </Select>
                                                </template>
                                                <template v-else-if="opt.type === 'select' && opt.source === 'pterodactyl_eggs'">
                                                    <Select
                                                        :model-value="String(optionChoices[opt.id] ?? '')"
                                                        class="h-10"
                                                        :name="`option_choices[${opt.id}]`"
                                                        :disabled="dynamicEggs.length === 0"
                                                        @update:model-value="(v) => { optionChoices[opt.id] = v; }"
                                                    >
                                                        <option value="">
                                                            {{ dynamicEggs.length === 0 ? 'Bitte zuerst Nest wählen' : 'Bitte wählen' }}
                                                        </option>
                                                        <option
                                                            v-for="e in dynamicEggs"
                                                            :key="e.id"
                                                            :value="String(e.id)"
                                                        >
                                                            {{ e.name }}
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
                                        placeholder="z. B. Mein Minecraft Server"
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
                                            <span class="tabular-nums">{{ basePrice.toLocaleString('de-DE', { minimumFractionDigits: 2 }) }} €/Monat</span>
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
                                        <div class="space-y-2 border-t pt-3">
                                            <div class="flex flex-wrap items-center gap-2">
                                                <Input
                                                    v-model="discountCodeInput"
                                                    type="text"
                                                    placeholder="Rabattcode"
                                                    class="h-9 flex-1 min-w-[8rem]"
                                                    :disabled="discountCodeValidating"
                                                    @keydown.enter.prevent="applyDiscountCode()"
                                                />
                                                <Button type="button" variant="outline" size="sm" :disabled="discountCodeValidating || !discountCodeInput.trim()" @click="applyDiscountCode()">
                                                    {{ discountCodeValidating ? '…' : 'Einlösen' }}
                                                </Button>
                                                <Button v-if="appliedDiscount" type="button" variant="ghost" size="sm" @click="clearDiscountCode()">Entfernen</Button>
                                            </div>
                                            <p v-if="discountCodeError" class="text-sm text-destructive">{{ discountCodeError }}</p>
                                            <div v-if="appliedDiscount" class="flex justify-between text-sm text-green-600 dark:text-green-400">
                                                <span>Rabatt ({{ appliedDiscount.code }})</span>
                                                <span class="tabular-nums">− {{ appliedDiscount.discount_amount.toLocaleString('de-DE', { minimumFractionDigits: 2 }) }} €</span>
                                            </div>
                                            <input type="hidden" name="discount_code" :value="(appliedDiscount?.code ?? discountCodeInput).trim()" />
                                        </div>
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
                                    <Link href="/gaming" class="block">
                                        <Button type="button" variant="outline" class="w-full">Abbrechen</Button>
                                    </Link>
                                    </div>
                                </template>
                                <template v-else>
                                    <p class="text-sm text-muted-foreground">Bitte wählen Sie links ein Paket aus.</p>
                                    <div class="mt-auto flex flex-col gap-2">
                                        <Button type="submit" class="w-full" size="lg" disabled>Paket wählen</Button>
                                        <Link href="/gaming" class="block">
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
