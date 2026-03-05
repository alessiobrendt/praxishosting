<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3';
import { BookOpen, Key, ExternalLink } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heading, Text } from '@/components/ui/typography';
import AdminLayout from '@/layouts/AdminLayout.vue';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';

type Props = {
    apiBaseUrl: string;
};

defineProps<Props>();

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Admin', href: '/admin' },
    { title: 'API', href: '#' },
];
</script>

<template>
    <AdminLayout :breadcrumbs="breadcrumbs">
        <Head title="API Übersicht" />

        <div class="space-y-6">
            <div>
                <Heading level="h1">Public API</Heading>
                <Text class="mt-2" muted>
                    Die API liefert Daten für Ihre Landing-Page und Konfiguratoren: Unternehmens-Statistiken,
                    Domain-Preise und Verfügbarkeit, Hosting-Pläne inkl. Konfiguration sowie Pterodactyl Nests und Eggs.
                </Text>
            </div>

            <div class="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle class="flex items-center gap-2">
                            <BookOpen class="h-5 w-5" />
                            Dokumentation
                        </CardTitle>
                        <CardDescription>
                            Alle Endpoints mit Methode, URL, Headers und Request/Response-Beispielen
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Link :href="'/admin/api/docs'">
                            <Button variant="outline" class="w-full sm:w-auto">
                                <ExternalLink class="mr-2 h-4 w-4" />
                                Zur API-Dokumentation
                            </Button>
                        </Link>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle class="flex items-center gap-2">
                            <Key class="h-5 w-5" />
                            API-Tokens
                        </CardTitle>
                        <CardDescription>
                            Erstellen und verwalten Sie Tokens in den Einstellungen. Jeder Token wird einmalig im Klartext angezeigt.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Link href="/settings/api-tokens">
                            <Button variant="outline" class="w-full sm:w-auto">
                                <Key class="mr-2 h-4 w-4" />
                                API-Tokens verwalten
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Authentifizierung</CardTitle>
                    <CardDescription>
                        Alle API-Anfragen müssen den Header
                        <code class="rounded bg-muted px-1.5 py-0.5 font-mono text-sm"
                            >Authorization: Bearer &lt;Ihr-Token&gt;</code
                        >
                        enthalten. Tokens erstellen Sie unter Einstellungen → API-Tokens.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p class="text-sm text-muted-foreground">
                        Basis-URL: <code class="rounded bg-muted px-1.5 py-0.5 font-mono break-all">{{ apiBaseUrl }}</code>
                    </p>
                </CardContent>
            </Card>
        </div>
    </AdminLayout>
</template>
