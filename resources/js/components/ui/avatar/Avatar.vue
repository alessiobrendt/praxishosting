<script setup lang="ts">
import { computed } from 'vue';
import { cn } from '@/lib/utils';

type AvatarSize = 'sm' | 'md' | 'lg';

interface Props {
    src?: string;
    alt?: string;
    name?: string;
    size?: AvatarSize;
    class?: string;
}

const props = withDefaults(defineProps<Props>(), {
    size: 'md',
});

const sizeClasses: Record<AvatarSize, string> = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-12 w-12 text-base',
};

const avatarClasses = computed(() =>
    cn(
        'relative flex shrink-0 overflow-hidden rounded-full',
        sizeClasses[props.size],
        props.class,
    ),
);

const initials = computed(() => {
    if (!props.name) return '';
    return props.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
});
</script>

<template>
    <div :class="avatarClasses">
        <img
            v-if="src"
            :src="src"
            :alt="alt || name"
            class="h-full w-full object-cover"
        />
        <div
            v-else
            class="flex h-full w-full items-center justify-center gradient-primary text-white font-medium"
        >
            {{ initials }}
        </div>
    </div>
</template>
