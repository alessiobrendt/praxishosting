<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3';
import AppLayout from '@/layouts/AppLayout.vue';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Heading, Text } from '@/components/ui/typography';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';
import { ExternalLink } from 'lucide-vue-next';

type GameServerAccount = {
    id: number;
    name: string;
    status: string;
    identifier: string | null;
    current_period_ends_at: string | null;
    cancel_at_period_end: boolean;
    hosting_plan: { name: string };
};

type Props = {
    gameServerAccount: GameServerAccount;
    loginUrl: string | null;
};

const props = defineProps<Props>();

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Meine Game Server', href: '/gaming-accounts' },
    { title: props.gameServerAccount.name, href: '#' },
];

const formatDate = (d: string | null) => (d ? new Date(d).toLocaleDateString('de-DE') : '-');
</script>

<template>
    <AppLayout :breadcrumbs="breadcrumbs">
        <Head :title="gameServerAccount.name" />

        <div class="space-y-6">
            <div class="flex items-center justify-between">
                <div>
                    <Heading level="h1">{{ gameServerAccount.name }}</Heading>
                    <Text class="mt-2" muted>
                        {{ gameServerAccount.hosting_plan.name }} · Status: {{ gameServerAccount.status }}
                    </Text>
                </div>
                <div class="flex gap-2">
                    <Link v-if="loginUrl" :href="loginUrl" target="_blank" rel="noopener noreferrer">
                        <Button>
                            <ExternalLink class="mr-2 h-4 w-4" />
                            Zum Pterodactyl-Panel
                        </Button>
                    </Link>
                    <Link href="/billing/portal">
                        <Button variant="outline">Abo verwalten</Button>
                    </Link>
                </div>
            </div>

            <Card v-if="!loginUrl && gameServerAccount.status === 'pending'" class="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30">
                <CardContent class="pt-6">
                    <Text>
                        Ihr Game-Server wird eingerichtet, oder für das zugehörige Hosting-Paket ist im Admin kein Pterodactyl-Panel-Server hinterlegt. Bitte im Admin unter Hosting-Pakete beim betreffenden Paket einen Panel-Server angeben bzw. uns kontaktieren.
                    </Text>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Übersicht</CardTitle>
                    <CardDescription>Server-Identifier und Abo-Informationen</CardDescription>
                </CardHeader>
                <CardContent class="space-y-4">
                    <div class="flex flex-wrap items-center gap-2">
                        <Badge variant="secondary">{{ gameServerAccount.status }}</Badge>
                        <span v-if="gameServerAccount.identifier" class="text-sm text-muted-foreground">
                            Identifier: <code class="rounded bg-muted px-1.5 py-0.5 font-mono">{{ gameServerAccount.identifier }}</code>
                        </span>
                    </div>
                    <dl class="grid gap-2 text-sm">
                        <div class="flex justify-between">
                            <dt class="text-muted-foreground">Verlängerung</dt>
                            <dd>{{ formatDate(gameServerAccount.current_period_ends_at) }}</dd>
                        </div>
                        <div v-if="gameServerAccount.cancel_at_period_end" class="flex justify-between text-amber-600 dark:text-amber-400">
                            <dt>Abo endet zum Periodenende</dt>
                            <dd>Ja</dd>
                        </div>
                    </dl>
                </CardContent>
            </Card>
        </div>
    </AppLayout>
</template>
