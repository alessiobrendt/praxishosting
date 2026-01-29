<script setup lang="ts">
import { Link } from '@inertiajs/vue3';
import { cn } from '@/lib/utils';

interface Props {
    href: string;
    tabindex?: number;
    as?: string;
}

const props = withDefaults(defineProps<Props>(), {
    tabindex: undefined,
    as: undefined,
});
</script>

<template>
    <Link
        :href="href"
        :class="cn(
            'text-emerald-700 underline-offset-4 hover:underline dark:text-emerald-400',
            'transition-modern',
            $attrs.class,
        )"
        :tabindex="tabindex"
        :as="as"
    >
        <slot />
    </Link>
</template>
