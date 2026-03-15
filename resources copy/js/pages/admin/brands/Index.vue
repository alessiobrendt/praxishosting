<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3';
import { Edit, Globe, Building2, Mail } from 'lucide-vue-next';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Heading, Text } from '@/components/ui/typography';
import AdminLayout from '@/layouts/AdminLayout.vue';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';

type Brand = {
    id: number;
    key: string;
    name: string;
    is_default: boolean;
    domains: string[] | null;
    logo_url: string | null;
    logo_collapsed_url: string | null;
    theme_colors: Record<string, string> | null;
    features: Record<string, boolean | number> | null;
    salutation: string | null;
    seo: Record<string, string> | null;
};

type Props = {
    brands: Brand[];
};

defineProps<Props>();

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Admin', href: '/admin' },
    { title: 'Marken', href: '#' },
];

function firstDomains(domains: string[] | null, max = 2): string[] {
    if (!domains?.length) return [];
    return domains.slice(0, max);
}

function primaryColor(brand: Brand): string {
    return (
        brand.theme_colors?.primary ??
        brand.seo?.theme_color ??
        'var(--primary, #059669)'
    );
}

const FEATURE_LABELS: Record<string, string> = {
    sites_editor: 'Sites',
    webspace: 'Webspace',
    domains_shop: 'Domains',
    ai_tokens: 'AI',
    gaming: 'Gaming',
    prepaid_balance: 'Guthaben',
    balance_topup: 'Aufladung',
};

function activeFeatures(features: Record<string, boolean | number> | null): string[] {
    if (!features) return [];
    return Object.entries(FEATURE_LABELS)
        .filter(([key]) => features[key] === true)
        .map(([, label]) => label);
}

function salutationLabel(salutation: string | null): string {
    return salutation === 'informal' ? 'Du' : 'Sie';
}
</script>

<template>
    <AdminLayout :breadcrumbs="breadcrumbs">
        <Head title="Marken" />

        <div class="space-y-6">
            <div>
                <Heading level="h1">Marken / Unternehmen</Heading>
                <Text class="mt-2" muted>
                    B2B und Privat/Gaming: Name, Domains, Farben, Features und E-Mail pro Marke
                </Text>
            </div>

            <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <Link
                    v-for="brand in brands"
                    :key="brand.id"
                    :href="`/admin/brands/${brand.id}/edit`"
                    class="group block transition-transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background rounded-xl"
                >
                    <Card
                        class="h-full overflow-hidden border-2 transition-colors group-hover:border-primary/40 group-focus:border-primary"
                        :style="{
                            borderLeftColor: primaryColor(brand),
                            borderLeftWidth: '4px',
                        }"
                    >
                        <CardContent class="p-0">
                            <div class="flex flex-col sm:flex-row sm:items-stretch">
                                <div
                                    class="flex shrink-0 items-center justify-center px-6 py-8 sm:w-36 sm:flex-col sm:py-6"
                                    :style="{
                                        backgroundColor: `${primaryColor(brand)}12`,
                                    }"
                                >
                                    <img
                                        v-if="brand.logo_url || brand.logo_collapsed_url"
                                        :src="brand.logo_url || brand.logo_collapsed_url!"
                                        :alt="brand.name"
                                        class="max-h-16 w-auto object-contain sm:max-h-20"
                                        loading="lazy"
                                    />
                                    <div
                                        v-else
                                        class="flex h-16 w-16 items-center justify-center rounded-xl text-white/80 sm:h-20 sm:w-20"
                                        :style="{ backgroundColor: primaryColor(brand) }"
                                    >
                                        <Building2 class="h-8 w-8 sm:h-10 sm:w-10" />
                                    </div>
                                    <div
                                        class="mt-2 flex gap-1 sm:mt-3"
                                        :title="primaryColor(brand)"
                                    >
                                        <span
                                            class="h-4 w-4 rounded-full border border-gray-300 shadow-sm dark:border-gray-600"
                                            :style="{ backgroundColor: primaryColor(brand) }"
                                        />
                                        <span
                                            v-if="brand.theme_colors?.primary_hover"
                                            class="h-4 w-4 rounded-full border border-gray-300 shadow-sm dark:border-gray-600"
                                            :style="{ backgroundColor: brand.theme_colors.primary_hover }"
                                        />
                                    </div>
                                </div>
                                <div class="flex flex-1 flex-col justify-between p-5">
                                    <div>
                                        <div class="flex flex-wrap items-center gap-2">
                                            <span class="text-lg font-semibold text-foreground">{{ brand.name }}</span>
                                            <Badge v-if="brand.is_default" variant="secondary" class="shrink-0">
                                                Standard
                                            </Badge>
                                        </div>
                                        <p class="mt-1 text-sm text-muted-foreground">{{ brand.key }}</p>
                                        <div
                                            v-if="firstDomains(brand.domains).length"
                                            class="mt-3 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground"
                                        >
                                            <Globe class="h-3.5 w-3.5 shrink-0" />
                                            <span>{{ firstDomains(brand.domains).join(', ') }}</span>
                                            <span v-if="brand.domains && brand.domains.length > 2">
                                                (+{{ brand.domains.length - 2 }} weitere)
                                            </span>
                                        </div>
                                        <div class="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                                            <span class="flex items-center gap-1">
                                                <Mail class="h-3.5 w-3.5" />
                                                Anrede: {{ salutationLabel(brand.salutation) }}
                                            </span>
                                        </div>
                                        <div
                                            v-if="activeFeatures(brand.features).length"
                                            class="mt-3 flex flex-wrap gap-1.5"
                                        >
                                            <span
                                                v-for="label in activeFeatures(brand.features)"
                                                :key="label"
                                                class="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground"
                                            >
                                                {{ label }}
                                            </span>
                                        </div>
                                    </div>
                                    <div class="mt-4 flex items-center gap-2">
                                        <Button variant="outline" size="sm" class="gap-2" as="span">
                                            <Edit class="h-4 w-4" />
                                            Bearbeiten
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </Link>
            </div>
        </div>
    </AdminLayout>
</template>
