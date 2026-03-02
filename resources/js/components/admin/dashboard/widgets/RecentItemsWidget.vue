<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Link } from '@inertiajs/vue3';
import { getAdminRecent } from '@/composables/useAdminRecent';
import type { AdminRecentItem } from '@/composables/useAdminRecent';

const recentItems = ref<AdminRecentItem[]>([]);

onMounted(() => {
    recentItems.value = getAdminRecent();
});
</script>

<template>
    <CardHeader class="py-3">
        <CardTitle>Zuletzt angesehen</CardTitle>
        <CardDescription>Zuletzt geöffnete Sites und Kunden</CardDescription>
    </CardHeader>
    <CardContent class="pt-0">
        <ul v-if="recentItems.length" class="flex flex-wrap gap-2">
            <li v-for="(item, i) in recentItems" :key="i">
                <Link
                    :href="item.url"
                    class="rounded-md bg-muted px-2 py-1 text-sm text-primary hover:underline"
                >
                    {{ item.label }}
                </Link>
            </li>
        </ul>
        <p v-else class="text-sm text-muted-foreground">Noch keine Einträge.</p>
    </CardContent>
</template>
