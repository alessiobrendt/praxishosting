<script setup lang="ts">
import { CardHeader, CardTitle, CardContent } from '@/components/ui/card';

defineProps<{
    data?: { total?: number; legacy?: number; suspended?: number } | null;
}>();
</script>

<template>
    <CardHeader class="py-3">
        <CardTitle class="text-sm font-medium">Webseiten-Statistik</CardTitle>
    </CardHeader>
    <CardContent class="pt-0">
        <div class="flex flex-wrap gap-4">
            <span class="text-2xl font-bold">{{ data?.total ?? 0 }}</span>
            <span class="text-muted-foreground text-sm">Legacy: {{ data?.legacy ?? 0 }}</span>
            <span class="text-muted-foreground text-sm">Gesperrt: {{ data?.suspended ?? 0 }}</span>
        </div>
    </CardContent>
</template>
