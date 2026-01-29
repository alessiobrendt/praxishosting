<script setup lang="ts">
import { Head } from '@inertiajs/vue3';
import AppLayout from '@/layouts/AppLayout.vue';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Heading, Text } from '@/components/ui/typography';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, Users, Globe, FileText } from 'lucide-vue-next';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];
</script>

<template>
    <Head title="Dashboard" />

    <AppLayout :breadcrumbs="breadcrumbs">
        <div class="space-y-6">
            <div>
                <Heading level="h1">Dashboard</Heading>
                <Text class="mt-2" muted>
                    Willkommen zurück! Hier ist eine Übersicht Ihrer Aktivitäten.
                </Text>
            </div>

            <!-- Stats Grid -->
            <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card hover>
                    <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle class="text-sm font-medium">Sites</CardTitle>
                        <Globe class="h-4 w-4 text-emerald-700" />
                    </CardHeader>
                    <CardContent>
                        <div class="text-2xl font-bold">12</div>
                        <Text variant="small" muted class="mt-1">
                            +2 seit letztem Monat
                        </Text>
                    </CardContent>
                </Card>

                <Card hover>
                    <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle class="text-sm font-medium">Templates</CardTitle>
                        <FileText class="h-4 w-4 text-emerald-700" />
                    </CardHeader>
                    <CardContent>
                        <div class="text-2xl font-bold">8</div>
                        <Text variant="small" muted class="mt-1">
                            Verfügbar
                        </Text>
                    </CardContent>
                </Card>

                <Card hover>
                    <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle class="text-sm font-medium">Benutzer</CardTitle>
                        <Users class="h-4 w-4 text-emerald-700" />
                    </CardHeader>
                    <CardContent>
                        <div class="text-2xl font-bold">1,234</div>
                        <Text variant="small" muted class="mt-1">
                            +12% seit letztem Monat
                        </Text>
                    </CardContent>
                </Card>

                <Card hover>
                    <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle class="text-sm font-medium">Wachstum</CardTitle>
                        <TrendingUp class="h-4 w-4 text-emerald-700" />
                    </CardHeader>
                    <CardContent>
                        <div class="text-2xl font-bold">+24%</div>
                        <Text variant="small" muted class="mt-1">
                            Im Vergleich zum Vormonat
                        </Text>
                    </CardContent>
                </Card>
            </div>

            <!-- Recent Activity -->
            <div class="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Letzte Aktivitäten</CardTitle>
                        <CardDescription>Ihre neuesten Aktionen</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div class="space-y-4">
                            <div class="flex items-center justify-between">
                                <div>
                                    <Text class="font-medium">Neue Site erstellt</Text>
                                    <Text variant="small" muted>vor 2 Stunden</Text>
                                </div>
                                <Badge variant="success">Neu</Badge>
                            </div>
                            <div class="flex items-center justify-between">
                                <div>
                                    <Text class="font-medium">Template aktualisiert</Text>
                                    <Text variant="small" muted>vor 5 Stunden</Text>
                                </div>
                                <Badge variant="info">Aktualisiert</Badge>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Schnellaktionen</CardTitle>
                        <CardDescription>Häufig verwendete Funktionen</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div class="space-y-2">
                            <Button class="w-full justify-start" variant="outline">
                                <Globe class="mr-2 h-4 w-4" />
                                Neue Site erstellen
                            </Button>
                            <Button class="w-full justify-start" variant="outline">
                                <FileText class="mr-2 h-4 w-4" />
                                Template durchsuchen
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    </AppLayout>
</template>
