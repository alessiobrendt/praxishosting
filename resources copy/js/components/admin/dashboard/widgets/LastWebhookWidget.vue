<script setup lang="ts">
import { CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Text } from '@/components/ui/typography';

defineProps<{
    data?: { minutesAgo?: number | null } | null;
}>();
</script>

<template>
    <CardHeader class="py-3">
        <CardTitle class="text-sm font-medium">Mollie Webhook</CardTitle>
        <CardDescription>Letzter empfangener Webhook</CardDescription>
    </CardHeader>
    <CardContent class="pt-0">
        <Text v-if="data?.minutesAgo != null" class="text-sm">
            Vor {{ data.minutesAgo }} Minute(n)
        </Text>
        <Text v-else class="text-sm text-muted-foreground">
            Kein Webhook empfangen (oder Cache leer)
        </Text>
    </CardContent>
</template>
