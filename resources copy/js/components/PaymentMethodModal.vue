<script setup lang="ts">
import { router, usePage } from '@inertiajs/vue3';
import { Wallet } from 'lucide-vue-next';
import { ref, watch, computed } from 'vue';
import PaymentMethodLogo from '@/components/PaymentMethodLogo.vue';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

export interface PeriodOption {
    months: number;
    label: string;
}

interface Props {
    open: boolean;
    amount: number;
    title: string;
    description?: string;
    canPayWithBalance: boolean;
    customerBalance: number;
    submitUrl: string;
    submitPayload?: Record<string, string | number>;
    /** Wenn gesetzt: Laufzeit-Auswahl im Modal anzeigen, Betrag = baseAmountPerMonth × gewählte Monate */
    periodOptions?: PeriodOption[];
    baseAmountPerMonth?: number;
}

const props = withDefaults(defineProps<Props>(), {
    description: '',
    submitPayload: () => ({}),
    periodOptions: () => [],
});

const emit = defineEmits<{
    (e: 'update:open', value: boolean): void;
}>();

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
const submitting = ref(false);
const selectedPeriodMonths = ref(1);

const hasPeriodSelector = computed(() => (props.periodOptions?.length ?? 0) > 0 && typeof props.baseAmountPerMonth === 'number');

const effectiveAmount = computed(() => {
    if (hasPeriodSelector.value) {
        return props.baseAmountPerMonth! * selectedPeriodMonths.value;
    }
    return props.amount;
});

const canSubmitBalance = computed(
    () =>
        props.canPayWithBalance &&
        props.customerBalance >= effectiveAmount.value &&
        effectiveAmount.value > 0,
);

function close(): void {
    emit('update:open', false);
}

function submit(): void {
    if (submitting.value) return;
    const method = paymentMethod.value;
    if (method === 'balance' && !canSubmitBalance.value) return;

    submitting.value = true;
    const payload: Record<string, string | number> = {
        ...props.submitPayload,
        payment_method: method,
    };
    if (hasPeriodSelector.value) {
        payload.period_months = selectedPeriodMonths.value;
    }

    router.post(props.submitUrl, payload, {
        preserveScroll: true,
        preserveState: true,
        onFinish: () => {
            submitting.value = false;
        },
        onSuccess: () => {
            close();
        },
    });
}

watch(
    () => props.open,
    (isOpen) => {
        if (isOpen) {
            selectedPeriodMonths.value = props.periodOptions?.[0]?.months ?? 1;
            paymentMethod.value = props.canPayWithBalance && canSubmitBalance.value ? 'balance' : 'mollie';
        }
    },
);
</script>

<template>
    <Dialog :open="open" @update:open="(v) => emit('update:open', v)">
        <DialogContent class="sm:max-w-md" :show-close-button="true">
            <DialogHeader>
                <DialogTitle>{{ title }}</DialogTitle>
                <DialogDescription v-if="description">
                    {{ description }}
                </DialogDescription>
            </DialogHeader>

            <div class="space-y-4 py-2">
                <div v-if="hasPeriodSelector" class="space-y-2">
                    <label class="text-sm font-medium text-muted-foreground">Laufzeit</label>
                    <select
                        v-model.number="selectedPeriodMonths"
                        class="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
                    >
                        <option
                            v-for="opt in periodOptions"
                            :key="opt.months"
                            :value="opt.months"
                        >
                            {{ opt.label }} – {{ (baseAmountPerMonth! * opt.months).toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }} €
                        </option>
                    </select>
                </div>

                <p class="text-sm font-medium text-muted-foreground">
                    Betrag: {{ effectiveAmount.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }} €
                </p>

                <div class="space-y-3">
                    <label
                        class="flex cursor-pointer flex-col gap-2 rounded-lg border p-4 transition-colors hover:bg-muted/50"
                        :class="paymentMethod === 'mollie' && 'border-primary bg-primary/5 ring-1 ring-primary'"
                    >
                        <div class="flex items-center gap-2">
                            <input
                                v-model="paymentMethod"
                                type="radio"
                                name="payment_method_modal"
                                value="mollie"
                                class="h-4 w-4"
                            />
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
                        class="flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition-colors"
                        :class="[
                            canSubmitBalance ? 'hover:bg-muted/50' : 'cursor-not-allowed opacity-60',
                            paymentMethod === 'balance' && canSubmitBalance && 'border-primary bg-primary/5 ring-1 ring-primary',
                        ]"
                    >
                        <input
                            v-model="paymentMethod"
                            type="radio"
                            name="payment_method_modal"
                            value="balance"
                            :disabled="!canSubmitBalance"
                            class="h-4 w-4"
                        />
                        <Wallet class="h-5 w-5 text-muted-foreground" />
                        <span class="text-sm font-medium">Mit Guthaben bezahlen</span>
                        <span v-if="canSubmitBalance" class="ml-auto text-sm text-muted-foreground">
                            ({{ customerBalance.toLocaleString('de-DE', { minimumFractionDigits: 2 }) }} € verfügbar)
                        </span>
                        <span v-else class="ml-auto text-xs text-muted-foreground">
                            {{ customerBalance >= effectiveAmount ? '' : 'Guthaben reicht nicht aus' }}
                        </span>
                    </label>
                </div>
            </div>

            <DialogFooter>
                <Button variant="outline" @click="close">
                    Abbrechen
                </Button>
                <Button
                    :disabled="submitting || (paymentMethod === 'balance' && !canSubmitBalance)"
                    @click="submit"
                >
                    {{ submitting ? 'Wird weitergeleitet…' : 'Jetzt zahlen' }}
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
</template>
