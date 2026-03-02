<script setup lang="ts">
import { computed } from 'vue';
import { CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Link } from '@inertiajs/vue3';

const props = withDefaults(
    defineProps<{
        data?: Record<string, unknown> | null;
        title?: string;
        description?: string;
        /** Key in data for the list (default 'items'). E.g. 'servers', 'nodes'. */
        itemsKey?: string;
        itemLink?: (item: Record<string, unknown>) => string;
        itemLabel?: (item: Record<string, unknown>) => string;
    }>(),
    { itemsKey: 'items' }
);

const items = computed(() => {
    const d = props.data;
    if (!d) return [];
    const list = d[props.itemsKey];
    return Array.isArray(list) ? list : [];
});
</script>

<template>
    <CardHeader class="py-3">
        <CardTitle class="text-sm font-medium">{{ title }}</CardTitle>
        <CardDescription v-if="description" class="text-xs">{{ description }}</CardDescription>
    </CardHeader>
    <CardContent class="pt-0">
        <ul v-if="items.length" class="space-y-1">
            <li v-for="(item, i) in items" :key="i">
                <Link
                    v-if="itemLink?.(item)"
                    :href="itemLink(item)"
                    class="text-primary hover:underline"
                >
                    {{ itemLabel?.(item) ?? (item as { number?: string }).number ?? String(item.id ?? i) }}
                </Link>
                <span v-else>{{ itemLabel?.(item) ?? (item as { number?: string }).number ?? String(item.id ?? i) }}</span>
            </li>
        </ul>
        <p v-else class="text-sm text-muted-foreground">Keine Einträge.</p>
    </CardContent>
</template>
