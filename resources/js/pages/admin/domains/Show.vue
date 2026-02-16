<script setup lang="ts">
import { Head, router, useForm } from '@inertiajs/vue3';
import { ref, onMounted } from 'vue';
import AppLayout from '@/layouts/AppLayout.vue';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Heading, Text } from '@/components/ui/typography';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import InputError from '@/components/InputError.vue';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';
import { pushAdminRecent } from '@/composables/useAdminRecent';

type User = {
    id: number;
    name: string;
    email: string;
} | null;

type Domain = {
    id: number;
    domain: string;
    user_id: number | null;
    skrime_id: string | null;
    status: string;
    registered_at: string | null;
    expires_at: string | null;
    auto_renew: boolean;
    purchase_price: string | null;
    sale_price: string | null;
    profit_margin: number;
    tld: string | null;
    nameservers: string[];
    user?: User;
};

type Customer = {
    id: number;
    name: string;
    email: string;
};

type Props = {
    domain: Domain;
    customers: Customer[];
};

const props = defineProps<Props>();
const { domain, customers } = props;

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Domains', href: '/admin/domains' },
    { title: props.domain.domain, href: '#' },
];

const customerForm = useForm({
    user_id: props.domain.user_id ?? '',
});

const nameserverForm = useForm({
    nameservers: props.domain.nameservers?.length
        ? [...props.domain.nameservers]
        : ['', ''],
});

const authcodeDialogOpen = ref(false);
const authcodeValue = ref('');
const authcodeLoading = ref(false);
const authcodeError = ref('');

const submitCustomer = () => {
    customerForm.put(`/admin/domains/${props.domain.id}/customer`, {
        preserveScroll: true,
    });
};

const renew = () => {
    router.post(`/admin/domains/${props.domain.id}/renew`);
};

const setAutoRenew = (enabled: boolean) => {
    router.post(`/admin/domains/${props.domain.id}/autorenew`, { auto_renew: enabled });
};

const fetchAuthcode = async () => {
    authcodeLoading.value = true;
    authcodeError.value = '';
    authcodeValue.value = '';
    authcodeDialogOpen.value = true;
    try {
        const res = await fetch(`/admin/domains/${props.domain.id}/authcode`);
        const data = await res.json();
        if (!res.ok) {
            authcodeError.value = data.error ?? 'Unbekannter Fehler';
            return;
        }
        authcodeValue.value = data.authcode ?? '';
    } catch (e) {
        authcodeError.value = e instanceof Error ? e.message : 'Fehler beim Laden';
    } finally {
        authcodeLoading.value = false;
    }
};

const cancelDomain = () => {
    if (confirm('Domain wirklich als gekündigt markieren?')) {
        router.post(`/admin/domains/${props.domain.id}/cancel`);
    }
};

const submitNameserver = () => {
    const ns = nameserverForm.nameservers.filter(Boolean);
    if (ns.length < 2 || ns.length > 6) {
        nameserverForm.setError('nameservers', 'Es sind 2 bis 6 Nameserver erforderlich.');
        return;
    }
    nameserverForm.nameservers = ns;
    nameserverForm.put(`/admin/domains/${props.domain.id}/nameserver`, {
        preserveScroll: true,
    });
};

const addNameserverSlot = () => {
    if (nameserverForm.nameservers.length < 6) {
        nameserverForm.nameservers.push('');
    }
};

const removeNameserverSlot = (index: number) => {
    if (nameserverForm.nameservers.length > 2) {
        nameserverForm.nameservers.splice(index, 1);
    }
};

onMounted(() => {
    pushAdminRecent({
        type: 'domain',
        id: props.domain.id,
        label: props.domain.domain,
        url: `/admin/domains/${props.domain.id}`,
    });
});
</script>

<template>
    <AppLayout :breadcrumbs="breadcrumbs">
        <Head :title="`Domain: ${domain.domain}`" />

        <div class="space-y-6">
            <div class="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <Heading level="h1">{{ domain.domain }}</Heading>
                    <Text class="mt-2" muted>
                        Skrime-ID: {{ domain.skrime_id ?? '–' }} · Status:
                        <Badge :variant="domain.status === 'active' ? 'success' : 'secondary'">
                            {{ domain.status }}
                        </Badge>
                    </Text>
                </div>
                <div class="flex flex-wrap gap-2">
                    <Button
                        v-if="domain.skrime_id"
                        variant="outline"
                        @click="renew"
                    >
                        Verlängern
                    </Button>
                    <Button
                        v-if="domain.skrime_id"
                        :variant="domain.auto_renew ? 'secondary' : 'outline'"
                        @click="setAutoRenew(!domain.auto_renew)"
                    >
                        {{ domain.auto_renew ? 'Auto-Renew aus' : 'Auto-Renew an' }}
                    </Button>
                    <Button variant="outline" @click="fetchAuthcode">
                        Auth-Code anzeigen
                    </Button>
                    <Button
                        v-if="domain.status === 'active'"
                        variant="destructive"
                        @click="cancelDomain"
                    >
                        Kündigen
                    </Button>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Domain-Daten</CardTitle>
                    <CardDescription>Registrierung, Ablauf, Preise</CardDescription>
                </CardHeader>
                <CardContent class="space-y-2">
                    <p><span class="font-medium">Registriert:</span> {{ domain.registered_at ?? '–' }}</p>
                    <p><span class="font-medium">Ablaufdatum:</span> {{ domain.expires_at ?? '–' }}</p>
                    <p><span class="font-medium">Auto-Renew:</span> {{ domain.auto_renew ? 'Ja' : 'Nein' }}</p>
                    <p><span class="font-medium">Einkaufspreis:</span> {{ domain.purchase_price != null ? `${domain.purchase_price} €` : '–' }}</p>
                    <p><span class="font-medium">Verkaufspreis:</span> {{ domain.sale_price != null ? `${domain.sale_price} €` : '–' }}</p>
                    <p><span class="font-medium">Gewinn:</span> {{ domain.profit_margin != null ? `${domain.profit_margin} €` : '–' }}</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Kunde zuweisen</CardTitle>
                    <CardDescription>Domain einem Kunden zuordnen oder Zuweisung aufheben</CardDescription>
                </CardHeader>
                <CardContent>
                    <form @submit.prevent="submitCustomer" class="space-y-4">
                        <div class="flex flex-wrap items-end gap-4">
                            <div class="space-y-2 min-w-[200px]">
                                <Label for="user_id">Kunde</Label>
                                <select
                                    id="user_id"
                                    v-model="customerForm.user_id"
                                    class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                >
                                    <option :value="''">– Kein Kunde –</option>
                                    <option
                                        v-for="c in customers"
                                        :key="c.id"
                                        :value="c.id"
                                    >
                                        {{ c.name }} ({{ c.email }})
                                    </option>
                                </select>
                                <InputError :message="customerForm.errors.user_id" />
                            </div>
                            <Button type="submit" :disabled="customerForm.processing">
                                Zuweisen
                            </Button>
                        </div>
                    </form>
                    <p v-if="domain.user" class="mt-2 text-sm text-muted">
                        Aktuell: {{ domain.user.name }} ({{ domain.user.email }})
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Nameserver</CardTitle>
                    <CardDescription>2–6 Nameserver (Skrime-Standard oder eigene)</CardDescription>
                </CardHeader>
                <CardContent>
                    <form @submit.prevent="submitNameserver" class="space-y-4">
                        <div
                            v-for="(ns, idx) in nameserverForm.nameservers"
                            :key="idx"
                            class="flex gap-2 items-center"
                        >
                            <Input
                                v-model="nameserverForm.nameservers[idx]"
                                placeholder="ns.example.com"
                                class="flex-1"
                            />
                            <Button
                                v-if="nameserverForm.nameservers.length > 2"
                                type="button"
                                variant="ghost"
                                size="sm"
                                @click="removeNameserverSlot(idx)"
                            >
                                Entfernen
                            </Button>
                        </div>
                        <div class="flex gap-2">
                            <Button
                                v-if="nameserverForm.nameservers.length < 6"
                                type="button"
                                variant="outline"
                                size="sm"
                                @click="addNameserverSlot"
                            >
                                + Nameserver
                            </Button>
                            <Button type="submit" :disabled="nameserverForm.processing">
                                Nameserver speichern
                            </Button>
                        </div>
                        <InputError :message="nameserverForm.errors.nameservers" />
                    </form>
                </CardContent>
            </Card>

            <Card v-if="domain.skrime_id">
                <CardHeader>
                    <CardTitle>DNS verwalten</CardTitle>
                    <CardDescription>A-, AAAA-, MX-, TXT-, CNAME-Records etc.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Link :href="`/admin/domains/${domain.id}/dns`">
                        <Button variant="outline">DNS-Zone bearbeiten</Button>
                    </Link>
                </CardContent>
            </Card>
        </div>

        <Dialog v-model:open="authcodeDialogOpen">
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Auth-Code (Transfer)</DialogTitle>
                    <DialogDescription>
                        Dieser Code wird beim Domain-Transfer beim neuen Anbieter benötigt.
                    </DialogDescription>
                </DialogHeader>
                <div v-if="authcodeLoading" class="py-4 text-center text-muted">Laden …</div>
                <div v-else-if="authcodeError" class="py-4 text-destructive">{{ authcodeError }}</div>
                <div v-else class="py-4">
                    <p class="font-mono text-lg break-all">{{ authcodeValue || '–' }}</p>
                </div>
                <DialogFooter>
                    <Button variant="outline" @click="authcodeDialogOpen = false">Schließen</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </AppLayout>
</template>
