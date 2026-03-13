<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const emit = defineEmits<{ (e: 'update:effectiveTotal', value: number): void }>();

const props = withDefaults(
    defineProps<{
        totalAmount: number;
        periodMonths?: number;
    }>(),
    { periodMonths: 1 },
);

const discountCodeInput = ref('');
const appliedDiscount = ref<{ discount_amount: number; final_amount: number; code: string } | null>(null);
const discountCodeError = ref('');
const discountCodeValidating = ref(false);

const effectiveTotal = computed(() =>
    appliedDiscount.value ? appliedDiscount.value.final_amount : props.totalAmount,
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
                amount: props.totalAmount,
                period_months: props.periodMonths,
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

watch(effectiveTotal, (value) => emit('update:effectiveTotal', value), { immediate: true });

defineExpose({
    effectiveTotal,
    appliedDiscount,
    discountCodeInput,
});
</script>

<template>
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
</template>
