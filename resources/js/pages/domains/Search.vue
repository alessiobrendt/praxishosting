<script setup lang="ts">
import { Head, router } from '@inertiajs/vue3';
import { ref, computed } from 'vue';
import AppLayout from '@/layouts/AppLayout.vue';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Heading, Text } from '@/components/ui/typography';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';
import { Search as SearchIcon, Loader2 } from 'lucide-vue-next';

type Props = {
    csrf_token?: string;
};

const props = withDefaults(defineProps<Props>(), { csrf_token: '' });

type Result = {
    domain: string;
    available: boolean;
    premium: boolean;
    sale_price: number;
    purchase_price: number;
    error?: boolean;
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Domains', href: '/domains' },
    { title: 'Domain suchen', href: '#' },
];

const domainInput = ref('');
const loading = ref(false);
const results = ref<Result[]>([]);
const defaultTlds = ['de', 'com', 'net', 'io'];

const canSearch = computed(() => domainInput.value.trim().length >= 2);

async function search() {
    if (!canSearch.value) return;
    loading.value = true;
    results.value = [];
    try {
        const res = await fetch('/domains/check-availability', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-CSRF-TOKEN': props.csrf_token || document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                'X-Requested-With': 'XMLHttpRequest',
            },
            body: JSON.stringify({
                domain: domainInput.value.trim().toLowerCase().replace(/\.(de|com|net|io)$/, ''),
                tlds: defaultTlds,
            }),
        });
        const data = await res.json();
        results.value = data.results ?? [];
    } catch {
        results.value = [];
    } finally {
        loading.value = false;
    }
}

function goToCheckout(r: Result) {
    if (!r.available || r.error) return;
    router.visit(`/domains/checkout?domain=${encodeURIComponent(r.domain)}&sale_price=${r.sale_price}&tld=${r.domain.split('.').pop() ?? ''}`);
}
</script>

<template>
    <AppLayout :breadcrumbs="breadcrumbs">
        <Head title="Domain suchen" />

        <div class="space-y-6">
            <div>
                <Heading level="h1">Domain suchen</Heading>
                <Text class="mt-2" muted>
                    Prüfen Sie die Verfügbarkeit und bestellen Sie Ihre Wunschdomain
                </Text>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Verfügbarkeit prüfen</CardTitle>
                    <CardDescription>
                        Geben Sie den gewünschten Namen ein (ohne Endung). Es werden .de, .com, .net und .io geprüft.
                    </CardDescription>
                </CardHeader>
                <CardContent class="space-y-4">
                    <div class="flex flex-wrap gap-4 items-end">
                        <div class="space-y-2 flex-1 min-w-[200px]">
                            <Label for="domain">Domain-Name</Label>
                            <Input
                                id="domain"
                                v-model="domainInput"
                                placeholder="meine-domain"
                                @keyup.enter="search"
                            />
                        </div>
                        <Button
                            :disabled="!canSearch || loading"
                            @click="search"
                        >
                            <Loader2 v-if="loading" class="mr-2 h-4 w-4 animate-spin" />
                            <SearchIcon v-else class="mr-2 h-4 w-4" />
                            Prüfen
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <Card v-if="results.length > 0">
                <CardHeader>
                    <CardTitle>Ergebnisse</CardTitle>
                    <CardDescription>Verfügbarkeit und Preise</CardDescription>
                </CardHeader>
                <CardContent>
                    <div class="space-y-3">
                        <div
                            v-for="r in results"
                            :key="r.domain"
                            class="flex flex-wrap items-center justify-between gap-4 py-2 border-b border-border last:border-0"
                        >
                            <div class="font-medium">{{ r.domain }}</div>
                            <div class="flex items-center gap-3">
                                <template v-if="r.error">
                                    <span class="text-muted">Fehler beim Prüfen</span>
                                </template>
                                <template v-else>
                                    <Badge :variant="r.available ? 'success' : 'secondary'">
                                        {{ r.available ? 'Verfügbar' : 'Belegt' }}
                                    </Badge>
                                    <Badge v-if="r.premium" variant="info">Premium</Badge>
                                    <span class="font-medium">{{ r.sale_price.toFixed(2) }} €</span>
                                    <Button
                                        v-if="r.available"
                                        size="sm"
                                        @click="goToCheckout(r)"
                                    >
                                        Bestellen
                                    </Button>
                                </template>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    </AppLayout>
</template>
