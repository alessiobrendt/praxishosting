<script setup lang="ts">
import { CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Link } from '@inertiajs/vue3';

defineProps<{
    data?: Record<string, unknown> | null;
    title?: string;
    description?: string;
    /** Link URL (e.g. /admin/customers/1). If not set, no link. */
    linkHref?: string;
    /** Primary line (e.g. name or number) */
    primary?: string;
    /** Secondary line (e.g. email or amount) */
    secondary?: string;
    /** Tertiary line (e.g. date) */
    tertiary?: string;
}>();
</script>

<template>
    <CardHeader class="py-3">
        <CardTitle class="text-sm font-medium">{{ title }}</CardTitle>
        <CardDescription v-if="description" class="text-xs">{{ description }}</CardDescription>
    </CardHeader>
    <CardContent class="pt-0">
        <div v-if="data" class="space-y-1 text-sm">
            <p v-if="primary" class="font-medium">{{ primary }}</p>
            <p v-if="secondary" class="text-muted-foreground">{{ secondary }}</p>
            <p v-if="tertiary" class="text-muted-foreground text-xs">{{ tertiary }}</p>
            <Link
                v-if="linkHref"
                :href="linkHref"
                class="inline-block mt-2 text-primary hover:underline text-xs"
            >
                Öffnen →
            </Link>
        </div>
        <p v-else class="text-sm text-muted-foreground">Keine Daten.</p>
    </CardContent>
</template>
