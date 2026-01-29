<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { computed } from 'vue';
import { useVueOTPContext } from 'vue-input-otp';
import { cn } from '@/lib/utils';

const props = defineProps<{ index: number; class?: HTMLAttributes['class'] }>();

const context = useVueOTPContext();

const slot = computed(() => context?.value.slots[props.index]);
</script>

<template>
    <div
        data-slot="input-otp-slot"
        :data-active="slot?.isActive"
        :class="cn(
            'relative flex h-10 w-10 items-center justify-center border-2 border-gray-300 text-sm transition-modern outline-none',
            'first:rounded-l-lg first:border-l',
            'last:rounded-r-lg',
            'data-[active=true]:z-10 data-[active=true]:border-emerald-500 data-[active=true]:ring-2 data-[active=true]:ring-emerald-500',
            'dark:border-gray-700',
            props.class,
        )"
    >
        {{ slot?.char }}
        <div v-if="slot?.hasFakeCaret" class="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div class="animate-pulse bg-emerald-700 h-4 w-0.5" />
        </div>
    </div>
</template>
