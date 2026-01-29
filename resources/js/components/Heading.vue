<script setup lang="ts">
import { Heading as TypographyHeading, Text } from '@/components/ui/typography';

type Props = {
    title: string;
    description?: string;
    variant?: 'default' | 'small';
};

withDefaults(defineProps<Props>(), {
    variant: 'default',
});
</script>

<template>
    <div :class="variant === 'small' ? 'space-y-1' : 'mb-8 space-y-2'">
        <TypographyHeading
            :level="variant === 'small' ? 'h3' : 'h2'"
            :class="variant === 'small' ? 'text-lg' : ''"
        >
            {{ title }}
        </TypographyHeading>
        <Text v-if="description" variant="small" muted>
            {{ description }}
        </Text>
    </div>
</template>
