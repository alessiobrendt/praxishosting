<script setup lang="ts">
import { CardHeader, CardTitle, CardContent } from '@/components/ui/card';

defineProps<{
    data?: { value?: number } | null;
    title?: string;
}>();
</script>

<template>
    <CardHeader class="py-3">
        <CardTitle class="text-sm font-medium">{{ title }}</CardTitle>
    </CardHeader>
    <CardContent class="pt-0">
        <span class="text-2xl font-bold">{{ (data?.value ?? 0).toFixed(2) }} €</span>
    </CardContent>
</template>
