<script setup lang="ts">
import { Head } from '@inertiajs/vue3';
import AppearanceTabs from '@/components/AppearanceTabs.vue';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Heading, Text } from '@/components/ui/typography';
import AppLayout from '@/layouts/AppLayout.vue';
import SettingsLayout from '@/layouts/settings/Layout.vue';
import { edit } from '@/routes/appearance';
import { type BreadcrumbItem } from '@/types';

const breadcrumbItems: BreadcrumbItem[] = [
    {
        title: 'Einstellungen',
        href: edit().url,
    },
];
</script>

<template>
    <AppLayout :breadcrumbs="breadcrumbItems">
        <Head title="Erscheinungsbild-Einstellungen" />

        <SettingsLayout>
            <div class="space-y-6">
                <div>
                    <Heading level="h1">Erscheinungsbild</Heading>
                    <Text class="mt-2" muted>
                        Passen Sie das Erscheinungsbild der Anwendung an
                    </Text>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Theme-Einstellungen</CardTitle>
                        <CardDescription>Wählen Sie zwischen Light Mode und Dark Mode</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <AppearanceTabs />
                    </CardContent>
                </Card>
            </div>
        </SettingsLayout>
    </AppLayout>
</template>
