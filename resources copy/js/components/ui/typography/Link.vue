<script setup lang="ts">
import { computed } from 'vue';
import { cn } from '@/lib/utils';

interface Props {
    href?: string;
    class?: string;
    external?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    external: false,
});

const linkClasses = computed(() =>
    cn(
        'text-primary underline-offset-4 hover:underline',
        'transition-modern',
        props.class,
    ),
);
</script>

<template>
    <a
        :href="href"
        :class="linkClasses"
        :target="external ? '_blank' : undefined"
        :rel="external ? 'noopener noreferrer' : undefined"
    >
        <slot />
    </a>
</template>
