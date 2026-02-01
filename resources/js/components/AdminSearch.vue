<script setup lang="ts">
import { ref, watch } from 'vue';
import { Link } from '@inertiajs/vue3';
import { Input } from '@/components/ui/input';
import { Search, Globe, Users, FileText, Repeat } from 'lucide-vue-next';
import { useDebounceFn } from '@vueuse/core';

type SearchResult = {
    id: number;
    label: string;
    url: string;
};

type SearchResponse = {
    sites: SearchResult[];
    customers: SearchResult[];
    invoices: SearchResult[];
    subscriptions: SearchResult[];
};

const query = ref('');
const loading = ref(false);
const results = ref<SearchResponse | null>(null);
const hasSearched = ref(false);

const doSearch = useDebounceFn(async () => {
    const q = query.value.trim();
    if (q.length < 2) {
        results.value = null;
        hasSearched.value = false;
        return;
    }
    loading.value = true;
    hasSearched.value = true;
    try {
        const base = window.location.origin;
        const res = await fetch(`${base}/admin/search?q=${encodeURIComponent(q)}`, {
            headers: { Accept: 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
        });
        const data = (await res.json()) as SearchResponse;
        results.value = data;
    } catch {
        results.value = null;
    } finally {
        loading.value = false;
    }
}, 300);

watch(query, () => {
    doSearch();
});
</script>

<template>
    <div class="space-y-3">
        <div class="relative">
            <Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
                v-model="query"
                type="search"
                placeholder="Sites, Kunden, Rechnungen, Abos suchen… (min. 2 Zeichen)"
                class="pl-9"
                autocomplete="off"
            />
        </div>
        <div v-if="loading" class="rounded-lg border border-border bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
            Suche…
        </div>
        <div
            v-else-if="hasSearched && results"
            class="rounded-lg border border-border bg-card"
        >
            <template v-if="results.sites?.length || results.customers?.length || results.invoices?.length || results.subscriptions?.length">
                <div class="divide-y divide-border">
                    <div v-if="results.sites?.length" class="p-2">
                        <p class="mb-1 px-2 text-xs font-medium text-muted-foreground">Sites</p>
                        <Link
                            v-for="item in results.sites"
                            :key="'site-' + item.id"
                            :href="item.url"
                            class="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-muted"
                        >
                            <Globe class="h-4 w-4 shrink-0 text-muted-foreground" />
                            {{ item.label }}
                        </Link>
                    </div>
                    <div v-if="results.customers?.length" class="p-2">
                        <p class="mb-1 px-2 text-xs font-medium text-muted-foreground">Kunden</p>
                        <Link
                            v-for="item in results.customers"
                            :key="'customer-' + item.id"
                            :href="item.url"
                            class="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-muted"
                        >
                            <Users class="h-4 w-4 shrink-0 text-muted-foreground" />
                            {{ item.label }}
                        </Link>
                    </div>
                    <div v-if="results.invoices?.length" class="p-2">
                        <p class="mb-1 px-2 text-xs font-medium text-muted-foreground">Rechnungen</p>
                        <Link
                            v-for="item in results.invoices"
                            :key="'invoice-' + item.id"
                            :href="item.url"
                            class="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-muted"
                        >
                            <FileText class="h-4 w-4 shrink-0 text-muted-foreground" />
                            {{ item.label }}
                        </Link>
                    </div>
                    <div v-if="results.subscriptions?.length" class="p-2">
                        <p class="mb-1 px-2 text-xs font-medium text-muted-foreground">Abos</p>
                        <Link
                            v-for="item in results.subscriptions"
                            :key="'sub-' + item.id"
                            :href="item.url"
                            class="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-muted"
                        >
                            <Repeat class="h-4 w-4 shrink-0 text-muted-foreground" />
                            {{ item.label }}
                        </Link>
                    </div>
                </div>
            </template>
            <p v-else class="px-4 py-3 text-sm text-muted-foreground">
                Keine Treffer.
            </p>
        </div>
    </div>
</template>
