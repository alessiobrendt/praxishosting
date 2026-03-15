<script setup lang="ts">
import { Head, router } from '@inertiajs/vue3';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Heading, Text } from '@/components/ui/typography';
import AppLayout from '@/layouts/AppLayout.vue';
import SettingsLayout from '@/layouts/settings/Layout.vue';
import { edit } from '@/routes/profile';
import IntegrationController from '@/actions/App/Http/Controllers/Settings/IntegrationController';
import type { BreadcrumbItem } from '@/types';

type Props = {
    discordConnected: boolean;
    discordConnectUrl: string;
};

defineProps<Props>();

const breadcrumbItems: BreadcrumbItem[] = [
    { title: 'Einstellungen', href: edit().url },
    { title: 'Integration', href: '#' },
];

function disconnect() {
    router.delete(IntegrationController.disconnectDiscord().url, { preserveScroll: true });
}
</script>

<template>
    <AppLayout :breadcrumbs="breadcrumbItems">
        <Head title="Integration" />

        <SettingsLayout>
            <div class="space-y-6">
                <div>
                    <Heading level="h1">Integration</Heading>
                    <Text class="mt-2" muted>
                        Verbinden Sie externe Dienste mit Ihrem Konto. Sie können Discord später hier verbinden oder trennen.
                    </Text>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Discord</CardTitle>
                        <CardDescription>
                            Verbinden Sie Ihr Discord-Konto, um Benachrichtigungen per Direktnachricht zu erhalten und die Kunden-Rolle auf unserem Server zu nutzen.
                        </CardDescription>
                    </CardHeader>
                    <CardContent class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div class="flex items-center gap-2">
                            <span
                                class="inline-flex h-2 w-2 rounded-full"
                                :class="discordConnected ? 'bg-green-500' : 'bg-muted-foreground/50'"
                            />
                            <Text class="text-sm">
                                {{ discordConnected ? 'Discord verbunden' : 'Nicht verbunden' }}
                            </Text>
                        </div>
                        <div class="flex gap-2">
                            <Button
                                v-if="!discordConnected"
                                as="a"
                                :href="discordConnectUrl"
                            >
                                Discord verbinden
                            </Button>
                            <Button
                                v-else
                                variant="outline"
                                @click="disconnect"
                            >
                                Discord trennen
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </SettingsLayout>
    </AppLayout>
</template>
