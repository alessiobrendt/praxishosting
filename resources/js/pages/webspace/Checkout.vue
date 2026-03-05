<script setup lang="ts">
import { Form, Head, Link, usePage } from '@inertiajs/vue3';
import { watch, ref, computed } from 'vue';
import InputError from '@/components/InputError.vue';
import PaymentMethodLogo from '@/components/PaymentMethodLogo.vue';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
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
};

const props = defineProps<Props>();

const paymentMethod = ref<'stripe' | 'balance'>('stripe');
const canSubmitWithBalance = computed(() =>
    props.canPayWithBalance &&
    (props.customerBalance ?? 0) >= (props.amountRequired ?? 0)
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

        <div class="space-y-6">
            <div>
                <Heading level="h1">Webspace buchen</Heading>
                <Text class="mt-2" muted>
                    Domain angeben und Paket wählen
                </Text>
            </div>

            <Card class="max-w-xl">
                <CardHeader>
                    <CardTitle>Bestellung</CardTitle>
                    <CardDescription>Hauptdomain für Ihren Webspace und gewünschtes Paket</CardDescription>
                </CardHeader>
                <Form
                    action="/webspace/checkout"
                    method="post"
                    class="space-y-6"
                    v-slot="{ errors, processing }"
                >
                    <input type="hidden" name="payment_method" :value="paymentMethod" />
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
                                required
                                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                :aria-invalid="!!errors.hosting_plan_id"
                            >
                                <option value="">Bitte wählen</option>
                                <option
                                    v-for="plan in props.hostingPlans"
                                    :key="plan.id"
                                    :value="plan.id"
                                    :selected="props.selectedPlan?.id === plan.id"
                                >
                                    {{ plan.name }} – {{ plan.price }} €/Monat ({{ plan.disk_gb }} GB / {{ plan.traffic_gb }} GB Traffic)
                                </option>
                            </select>
                            <InputError :message="errors.hosting_plan_id" />
                        </div>
                        <div v-if="props.canPayWithBalance" class="space-y-2 rounded-md border p-4">
                            <Label class="text-base">Zahlungsart</Label>
                            <div class="flex flex-col gap-3">
                                <label class="flex cursor-pointer flex-col gap-2">
                                    <div class="flex items-center gap-2">
                                        <input v-model="paymentMethod" type="radio" name="payment_method" value="stripe" />
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
                                <label class="flex items-center gap-2">
                                    <input
                                        v-model="paymentMethod"
                                        type="radio"
                                        name="payment_method"
                                        value="balance"
                                        :disabled="!canSubmitWithBalance"
                                    />
                                    <span>Mit Guthaben bezahlen</span>
                                    <span v-if="canSubmitWithBalance" class="text-muted-foreground text-sm">
                                        (Aktuell {{ (props.customerBalance ?? 0).toLocaleString('de-DE', { minimumFractionDigits: 2 }) }} €)
                                    </span>
                                    <span v-else class="text-muted-foreground text-sm">
                                        – Guthaben reicht nicht aus (mind. {{ (props.amountRequired ?? 0).toLocaleString('de-DE', { minimumFractionDigits: 2 }) }} € nötig)
                                    </span>
                                </label>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter class="flex gap-2">
                        <Button type="submit" :disabled="processing">
                            {{ processing ? 'Wird weitergeleitet…' : (paymentMethod === 'balance' && canSubmitWithBalance ? 'Mit Guthaben bezahlen' : 'Weiter zur Zahlung') }}
                        </Button>
                        <Link href="/webspace">
                            <Button type="button" variant="outline">Abbrechen</Button>
                        </Link>
                    </CardFooter>
                </Form>
            </Card>
        </div>
    </AppLayout>
</template>
