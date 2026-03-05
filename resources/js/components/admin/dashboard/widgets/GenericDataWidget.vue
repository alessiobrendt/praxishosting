<script setup lang="ts">
import { Link } from '@inertiajs/vue3';
import { computed } from 'vue';
import { Button } from '@/components/ui/button';
import { CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

const props = defineProps<{
    data?: Record<string, unknown> | null;
    title?: string;
    description?: string;
    linkHref?: string;
    linkLabel?: string;
    /** Keys to show as key-value list (e.g. ['total', 'online']). If not set, all enumerable entries are shown. */
    keys?: string[];
}>();

const entries = computed(() => {
    const d = props.data;
    if (!d || typeof d !== 'object') return [];
    const keys = props.keys ?? Object.keys(d).filter((k) => k !== 'items' && d[k] !== undefined && d[k] !== null);
    return keys.map((k) => [k, d[k]] as const).filter(([, v]) => v !== undefined && v !== null);
});
</script>

<template>
    <CardHeader class="py-3">
        <CardTitle class="text-sm font-medium">{{ title }}</CardTitle>
        <CardDescription v-if="description" class="text-xs">{{ description }}</CardDescription>
    </CardHeader>
    <CardContent class="pt-0">
        <div v-if="data?.count !== undefined" class="space-y-2">
            <span class="text-2xl font-bold">{{ data.count }}</span>
            <div v-if="linkHref">
                <Link :href="linkHref">
                    <Button variant="ghost" size="sm">{{ linkLabel ?? 'Anzeigen' }}</Button>
                </Link>
            </div>
        </div>
        <dl v-else-if="entries.length" class="space-y-1 text-sm">
            <div v-for="(entry, i) in entries" :key="i" class="flex justify-between gap-2">
                <dt class="text-muted-foreground capitalize">{{ String(entry[0]).replace(/_/g, ' ') }}</dt>
                <dd class="font-medium">{{ typeof entry[1] === 'object' ? JSON.stringify(entry[1]) : String(entry[1]) }}</dd>
            </div>
        </dl>
        <p v-else class="text-sm text-muted-foreground">Keine Daten.</p>
    </CardContent>
</template>
