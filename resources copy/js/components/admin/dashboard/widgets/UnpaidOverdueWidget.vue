<script setup lang="ts">
import { Link } from '@inertiajs/vue3';
import { Button } from '@/components/ui/button';
import { CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Text } from '@/components/ui/typography';

defineProps<{
    data?: { unpaidSum?: number; overdueCount?: number } | null;
}>();
</script>

<template>
    <CardHeader class="py-3">
        <CardTitle class="text-sm font-medium">Offene Posten</CardTitle>
        <CardDescription>Summe unbezahlter Rechnungen</CardDescription>
    </CardHeader>
    <CardContent class="pt-0">
        <span class="text-2xl font-bold">{{ (data?.unpaidSum ?? 0).toFixed(2) }} €</span>
        <Text variant="small" muted class="mt-1 block">{{ data?.overdueCount ?? 0 }} überfällig</Text>
        <div class="mt-2">
            <Link href="/admin/invoices">
                <Button variant="ghost" size="sm">Rechnungen</Button>
            </Link>
        </div>
    </CardContent>
</template>
