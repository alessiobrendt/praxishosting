<script setup lang="ts">
import { Link } from '@inertiajs/vue3';
import { cn } from '@/lib/utils';

interface Props {
    href: string;
    tabindex?: number;
    as?: string;
}

withDefaults(defineProps<Props>(), {
    tabindex: undefined,
    as: undefined,
});
</script>

<template>
    <Link
        :href="href"
        :class="cn(
            'text-primary underline-offset-4 hover:underline',
            'transition-modern',
            $attrs.class,
        )"
        :tabindex="tabindex"
        :as="as"
    >
        <slot />
    </Link>
</template>
