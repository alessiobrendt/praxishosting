<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { MinusIcon } from 'lucide-vue-next';

defineProps<{ class?: HTMLAttributes['class'] }>();
</script>

<template>
    <div
        data-slot="input-otp-separator"
        role="separator"
        :class="class"
    >
        <slot>
            <MinusIcon class="h-4 w-4 text-gray-400" />
        </slot>
    </div>
</template>
