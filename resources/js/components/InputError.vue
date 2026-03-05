<script setup lang="ts">
import { computed } from 'vue';
import { Text } from '@/components/ui/typography';
import { cn } from '@/lib/utils';

interface Props {
    message?: string;
    class?: string;
}

const props = defineProps<Props>();

const hasError = computed(() => !!props.message);
</script>

<template>
    <Text
        v-if="hasError"
        variant="small"
        :class="cn('mt-1 text-red-600 dark:text-red-400', props.class)"
    >
        {{ props.message }}
    </Text>
</template>
