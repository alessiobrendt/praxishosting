<script setup lang="ts">
import { Heading, Text } from '@/components/ui/typography';

defineProps<{
    title: string;
    description?: string;
}>();
</script>

<template>
    <div class="flex items-center justify-between">
        <div>
            <Heading level="h1">{{ title }}</Heading>
            <Text v-if="description" class="mt-2" muted>
                {{ description }}
            </Text>
        </div>
        <slot name="action" />
    </div>
</template>
