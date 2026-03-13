<script setup lang="ts">
import { Head, Link, useForm } from '@inertiajs/vue3';
import { computed } from 'vue';
import { ArrowLeft, Globe, Server } from 'lucide-vue-next';
import InputError from '@/components/InputError.vue';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/AppLayout.vue';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';

type GameServerAccount = {
    id: number;
    name: string;
    subdomain: string;
};

type ResellerDomain = {
    uuid: string;
    domain: string;
};

type Props = {
    gameServerAccount: GameServerAccount;
    resellerDomains: ResellerDomain[];
    srvProtocol: string;
    srvProtocolType: string;
    connectDomainUrl: string;
    gameServerShowUrl: string;
};

const props = defineProps<Props>();

const form = useForm({
    reseller_domain_uuid: '' as string,
    subdomain: 'mc',
});

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Meine Game Server', href: '/gaming-accounts' },
    { title: props.gameServerAccount.name, href: props.gameServerShowUrl },
    { title: 'Domain verbinden', href: '#' },
];

const selectedDomain = computed(() =>
    props.resellerDomains.find((d) => d.uuid === form.reseller_domain_uuid),
);
const previewHost = computed(() => {
    const sub = (form.subdomain || 'mc').trim() || 'mc';
    const dom = selectedDomain.value?.domain ?? '';
    return dom ? `${sub}.${dom}` : '';
});
</script>

<template>
    <AppLayout :breadcrumbs="breadcrumbs">
        <Head title="Domain verbinden" />

        <div class="mx-auto max-w-2xl space-y-6">
            <div class="flex items-center gap-2">
                <Link :href="gameServerShowUrl">
                    <Button variant="ghost" size="sm">
                        <ArrowLeft class="mr-1 h-4 w-4" />
                        Zurück
                    </Button>
                </Link>
            </div>

            <Card>
                <CardContent class="pt-6">
                    <div class="mb-4 flex items-center gap-2 text-muted-foreground">
                        <Server class="h-5 w-5" />
                        <span>{{ gameServerAccount.name }}</span>
                        <span v-if="gameServerAccount.subdomain" class="text-xs">
                            (aktuell: {{ gameServerAccount.subdomain }})
                        </span>
                    </div>

                    <p class="mb-4 text-sm text-muted-foreground">
                        Wählen Sie eine Ihrer gekauften Domains und optional eine Subdomain (z. B. „mc“ für
                        mc.ihredomain.de). Der DNS-SRV-Eintrag wird automatisch gesetzt und zeigt auf diesen Server.
                    </p>

                    <p class="mb-4 text-xs text-muted-foreground">
                        Die Nameserver der Domain müssen auf uns zeigen, damit die Einträge wirksam werden. Dies können
                        Sie in der Domain-Verwaltung einstellen.
                    </p>

                    <form class="space-y-4" @submit.prevent="form.post(connectDomainUrl)">
                        <div class="space-y-2">
                            <Label for="reseller_domain_uuid">Domain</Label>
                            <select
                                id="reseller_domain_uuid"
                                v-model="form.reseller_domain_uuid"
                                name="reseller_domain_uuid"
                                required
                                class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                            >
                                <option value="">Domain wählen…</option>
                                <option
                                    v-for="d in resellerDomains"
                                    :key="d.uuid"
                                    :value="d.uuid"
                                >
                                    {{ d.domain }}
                                </option>
                            </select>
                            <InputError :message="form.errors.reseller_domain_uuid" />
                        </div>

                        <div class="space-y-2">
                            <Label for="subdomain">Subdomain (z. B. mc für mc.ihredomain.de)</Label>
                            <Input
                                id="subdomain"
                                v-model="form.subdomain"
                                name="subdomain"
                                type="text"
                                placeholder="mc"
                                class="max-w-xs"
                                maxlength="63"
                            />
                            <InputError :message="form.errors.subdomain" />
                        </div>

                        <div
                            v-if="previewHost"
                            class="rounded-md bg-muted/50 px-3 py-2 text-sm text-muted-foreground"
                        >
                            <Globe class="inline-block h-4 w-4 align-middle" />
                            {{ previewHost }}
                            zeigt nach dem Verbinden auf Ihren Server.
                        </div>

                        <div class="flex gap-2 pt-2">
                            <Button
                                type="submit"
                                :disabled="!form.reseller_domain_uuid || !(form.subdomain || '').trim() || form.processing"
                            >
                                {{ form.processing ? 'Wird verbunden…' : 'Verbinden' }}
                            </Button>
                            <Link :href="gameServerShowUrl">
                                <Button type="button" variant="outline">
                                    Abbrechen
                                </Button>
                            </Link>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    </AppLayout>
</template>
