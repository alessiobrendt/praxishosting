<script setup lang="ts">
import { Head, Link, router, useForm } from '@inertiajs/vue3';
import { usePage } from '@inertiajs/vue3';
import { Copy, Trash2, Check } from 'lucide-vue-next';
import { ref, computed } from 'vue';
import InputError from '@/components/InputError.vue';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Heading, Text } from '@/components/ui/typography';
import AppLayout from '@/layouts/AppLayout.vue';
import SettingsLayout from '@/layouts/settings/Layout.vue';
import type { BreadcrumbItem } from '@/types';

type Token = {
    id: number;
    name: string;
    last_used_at: string | null;
    created_at: string;
};

type Props = {
    tokens: Token[];
};

defineProps<Props>();

const page = usePage();
const flash = computed(() => page.props.flash as { newToken?: { plainTextToken: string; name: string } } | undefined);
const newToken = computed(() => flash.value?.newToken);
const copied = ref(false);

const breadcrumbItems: BreadcrumbItem[] = [
    { title: 'Einstellungen', href: '/settings/profile' },
    { title: 'API-Tokens', href: '#' },
];

const form = useForm({
    name: '',
});

function submitCreate(): void {
    form.post('/settings/api-tokens', {
        preserveScroll: true,
        onSuccess: () => form.reset('name'),
    });
}

function revoke(tokenId: number): void {
    if (!confirm('Token wirklich widerrufen? Er kann danach nicht mehr verwendet werden.')) return;
    router.delete(`/settings/api-tokens/${tokenId}`, { preserveScroll: true });
}

function copyToken(token: string): void {
    navigator.clipboard.writeText(token).then(() => {
        copied.value = true;
        setTimeout(() => (copied.value = false), 2000);
    });
}

function formatDate(iso: string | null): string {
    if (!iso) return '–';
    const d = new Date(iso);
    return d.toLocaleDateString('de-DE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}
</script>

<template>
    <AppLayout :breadcrumbs="breadcrumbItems">
        <Head title="API-Tokens" />

        <SettingsLayout>
            <div class="space-y-6">
                <div>
                    <Heading level="h1">API-Tokens</Heading>
                    <Text class="mt-2" muted>
                        Erstellen Sie Tokens für den Zugriff auf die Public API (z. B. für Ihre Landing-Page). Jeder Token
                        wird nur einmal im Klartext angezeigt – speichern Sie ihn sicher.
                    </Text>
                </div>

                <Card v-if="newToken" class="border-green-500/50 bg-green-500/5">
                    <CardHeader>
                        <CardTitle>Neuer Token erstellt</CardTitle>
                        <CardDescription>
                            Kopieren Sie den Token jetzt. Er wird nicht erneut angezeigt.
                        </CardDescription>
                    </CardHeader>
                    <CardContent class="space-y-2">
                        <p class="text-sm font-medium text-muted-foreground">{{ newToken.name }}</p>
                        <div class="flex flex-wrap items-center gap-2">
                            <code
                                class="flex-1 min-w-0 rounded bg-muted px-3 py-2 font-mono text-sm break-all"
                            >{{ newToken.plainTextToken }}</code>
                            <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                :title="copied ? 'Kopiert' : 'Kopieren'"
                                @click="copyToken(newToken.plainTextToken)"
                            >
                                <Check v-if="copied" class="h-4 w-4 text-green-600" />
                                <Copy v-else class="h-4 w-4" />
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Token erstellen</CardTitle>
                        <CardDescription>
                            Vergeben Sie einen Namen (z. B. „Landing Page“), um den Token später zu erkennen.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form class="flex flex-col gap-4 sm:flex-row sm:items-end" @submit.prevent="submitCreate">
                            <div class="flex-1 space-y-2">
                                <Label for="name">Name</Label>
                                <Input
                                    id="name"
                                    v-model="form.name"
                                    type="text"
                                    placeholder="z. B. Landing Page"
                                    class="max-w-xs"
                                    :disabled="form.processing"
                                />
                                <InputError :message="form.errors.name" />
                            </div>
                            <Button type="submit" :disabled="form.processing">
                                Token erstellen
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Ihre Tokens</CardTitle>
                        <CardDescription>
                            Widerrufen Sie einen Token, um den API-Zugriff sofort zu entziehen.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div v-if="tokens.length === 0" class="rounded-lg border border-dashed p-6 text-center text-muted-foreground">
                            Noch keine API-Tokens vorhanden.
                        </div>
                        <ul v-else class="divide-y">
                            <li
                                v-for="token in tokens"
                                :key="token.id"
                                class="flex flex-col gap-2 py-4 first:pt-0 sm:flex-row sm:items-center sm:justify-between"
                            >
                                <div>
                                    <p class="font-medium">{{ token.name }}</p>
                                    <p class="text-sm text-muted-foreground">
                                        Erstellt: {{ formatDate(token.created_at) }} · Zuletzt genutzt:
                                        {{ formatDate(token.last_used_at) }}
                                    </p>
                                </div>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    class="text-destructive hover:text-destructive shrink-0"
                                    @click="revoke(token.id)"
                                >
                                    <Trash2 class="mr-2 h-4 w-4" />
                                    Widerrufen
                                </Button>
                            </li>
                        </ul>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent class="pt-6">
                        <Text class="text-sm text-muted-foreground">
                            Die API-Übersicht und Dokumentation finden Sie im
                            <Link href="/admin/api" class="underline hover:no-underline">Admin-Bereich</Link>
                            (wenn Sie Admin-Rechte haben).
                        </Text>
                    </CardContent>
                </Card>
            </div>
        </SettingsLayout>
    </AppLayout>
</template>
