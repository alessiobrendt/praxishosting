<script setup lang="ts">
import { Form, Head, Link } from '@inertiajs/vue3';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Heading, Text } from '@/components/ui/typography';
import AdminLayout from '@/layouts/AdminLayout.vue';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';

type User = { id: number; name: string; email: string };
type HostingPlan = { id: number; name: string };
type HostingServer = { id: number; name: string | null; hostname: string } | null;

type GameServerAccount = {
    id: number;
    name: string;
    identifier: string | null;
    status: string;
    current_period_ends_at: string | null;
    stripe_subscription_id: string | null;
    user: User;
    hosting_plan: HostingPlan;
    hosting_server: HostingServer;
};

type Props = {
    gameServerAccount: GameServerAccount;
    loginUrl: string | null;
};

const props = defineProps<Props>();

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Game-Server-Accounts', href: '/admin/gaming-accounts' },
    { title: props.gameServerAccount.name, href: '#' },
];

const formatDate = (d: string | null) =>
    d ? new Date(d).toLocaleDateString('de-DE', { timeZone: 'UTC' }) : '–';
</script>

<template>
    <AdminLayout :breadcrumbs="breadcrumbs">
        <Head :title="`Game-Server: ${gameServerAccount.name}`" />

        <div class="space-y-6">
            <div class="flex items-center justify-between">
                <div>
                    <Heading level="h1">{{ gameServerAccount.name }}</Heading>
                    <Text class="mt-2" muted>
                        Pterodactyl-Game-Server – Kunde: {{ gameServerAccount.user.name }}
                    </Text>
                </div>
                <div class="flex items-center gap-2">
                    <Badge variant="secondary">{{ gameServerAccount.status }}</Badge>
                    <Form
                        v-if="gameServerAccount.status === 'pending'"
                        :action="`/admin/gaming-accounts/${gameServerAccount.id}/retry-provisioning`"
                        method="post"
                        class="inline"
                        v-slot="{ processing }"
                    >
                        <Button type="submit" variant="default" :disabled="processing">
                            {{ processing ? 'Wird ausgeführt…' : 'Installation neu anstoßen' }}
                        </Button>
                    </Form>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Zugang</CardTitle>
                    <CardDescription>Kunde kann sich damit im Pterodactyl-Panel anmelden</CardDescription>
                </CardHeader>
                <CardContent class="space-y-4">
                    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <Text class="text-sm font-medium text-muted-foreground">Kunde</Text>
                            <p class="font-medium">{{ gameServerAccount.user.name }}</p>
                            <p class="text-sm text-muted-foreground">{{ gameServerAccount.user.email }}</p>
                        </div>
                        <div>
                            <Text class="text-sm font-medium text-muted-foreground">Server-Name</Text>
                            <p class="font-medium">{{ gameServerAccount.name }}</p>
                        </div>
                        <div>
                            <Text class="text-sm font-medium text-muted-foreground">Identifier</Text>
                            <code v-if="gameServerAccount.identifier" class="rounded bg-gray-100 px-2 py-1 text-sm dark:bg-gray-800">{{ gameServerAccount.identifier }}</code>
                            <span v-else class="text-muted-foreground">–</span>
                        </div>
                        <div>
                            <Text class="text-sm font-medium text-muted-foreground">Plan / Server</Text>
                            <p class="font-medium">{{ gameServerAccount.hosting_plan.name }}</p>
                            <p class="text-sm text-muted-foreground">{{ gameServerAccount.hosting_server?.name ?? gameServerAccount.hosting_server?.hostname ?? '-' }}</p>
                        </div>
                    </div>
                    <div v-if="loginUrl" class="pt-4">
                        <a :href="loginUrl" target="_blank" rel="noopener noreferrer">
                            <Button>Im Pterodactyl-Panel öffnen</Button>
                        </a>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Abo</CardTitle>
                    <CardDescription>Stripe und Laufzeit</CardDescription>
                </CardHeader>
                <CardContent class="space-y-2">
                    <div>
                        <Text class="text-sm font-medium text-muted-foreground">Abo-Ende</Text>
                        <p>{{ formatDate(gameServerAccount.current_period_ends_at) }}</p>
                    </div>
                    <div v-if="gameServerAccount.stripe_subscription_id">
                        <Text class="text-sm font-medium text-muted-foreground">Stripe Subscription</Text>
                        <code class="rounded bg-gray-100 px-2 py-1 text-sm dark:bg-gray-800">{{ gameServerAccount.stripe_subscription_id }}</code>
                    </div>
                </CardContent>
            </Card>

            <div class="flex gap-2">
                <Link href="/admin/gaming-accounts">
                    <Button variant="outline">Zurück zur Liste</Button>
                </Link>
            </div>
        </div>
    </AdminLayout>
</template>
