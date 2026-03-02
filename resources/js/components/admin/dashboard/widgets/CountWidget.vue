<script setup lang="ts">
import { CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/vue3';

defineProps<{
    data?: { count?: number } | null;
    title?: string;
    description?: string;
    linkHref?: string;
    linkLabel?: string;
}>();
</script>

<template>
    <CardHeader class="py-3">
        <CardTitle class="text-sm font-medium">{{ title }}</CardTitle>
        <CardDescription v-if="description" class="text-xs">{{ description }}</CardDescription>
    </CardHeader>
    <CardContent class="pt-0">
        <span class="text-2xl font-bold">{{ data?.count ?? 0 }}</span>
        <div v-if="linkHref" class="mt-2">
            <Link :href="linkHref">
                <Button variant="ghost" size="sm">{{ linkLabel ?? 'Anzeigen' }}</Button>
            </Link>
        </div>
    </CardContent>
</template>
