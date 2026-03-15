<script setup lang="ts">
import { CreditCard, Landmark, Wallet } from 'lucide-vue-next';

interface Props {
    type: string;
    /** Size in pixels for icon/logos (default 24) */
    size?: number;
}

const props = withDefaults(defineProps<Props>(), { size: 24 });

const sizePx = `${props.size}px`;
</script>

<template>
    <!-- Karte / Card (Mollie: creditcard) -->
    <CreditCard
        v-if="type === 'card' || type === 'creditcard'"
        class="shrink-0 text-muted-foreground"
        :style="{ width: sizePx, height: sizePx }"
    />
    <!-- PayPal (Marken-P) -->
    <svg
        v-else-if="type === 'paypal'"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        class="shrink-0"
        :style="{ width: sizePx, height: sizePx }"
        aria-hidden
    >
        <path
            fill="#003087"
            d="M10.5 8.2H8.1c-.3 0-.5.2-.6.5L6 18.2c0 .2.2.4.4.4h1.6c.3 0 .5-.2.5-.4l.5-3.2c0-.2.2-.4.4-.4h.8c1.9 0 3.3-.8 4-2.3.4-.8.5-1.7.4-2.5-.2-1.5-1.4-2.5-3.2-2.5zm.6 4.2c-.2 1.1-1.1 1.1-2 1.1h-.5l.4-2.2c0-.1.2-.2.3-.2h.2c.6 0 1.2 0 1.5.5.2.3.2.7.1 1.1z"
        />
        <path
            fill="#0070E0"
            d="M17.2 7.9c-.4-.9-1.2-1.4-2.3-1.4h-3.2c-.3 0-.5.2-.6.5l-1.5 9.3c0 .2.2.4.4.4h1.8c.3 0 .5-.2.5-.4l.4-2.5c0-.2.2-.4.4-.4h.8c1.9 0 3.3-.8 4-2.3.4-.9.5-1.8.3-2.7-.3-1.3-1.3-2.2-2.6-2.2h-.8c-.2 0-.4.2-.4.4l-.2 1.2c0 .3.2.5.5.5h.4c.6 0 1.1.2 1.3.7.2.4.1.9-.2 1.2-.4.4-1 .6-1.8.6h-.4l-.4 2.4c0 .2.2.4.4.4h1.6c.3 0 .5-.2.6-.4l.1-.5.9-5.5.1-.6c.1-.5-.2-1-.6-1.3z"
        />
    </svg>
    <!-- SEPA / Bank (Mollie: directdebit) -->
    <Landmark
        v-else-if="type === 'sepa_debit' || type === 'directdebit'"
        class="shrink-0 text-muted-foreground"
        :style="{ width: sizePx, height: sizePx }"
    />
    <!-- Fallback für alle anderen (iDEAL, giropay, Apple Pay, etc.) -->
    <Wallet
        v-else
        class="shrink-0 text-muted-foreground"
        :style="{ width: sizePx, height: sizePx }"
    />
</template>
