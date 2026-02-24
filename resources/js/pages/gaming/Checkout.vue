<script setup lang="ts">
import { Form, Head, Link, usePage } from '@inertiajs/vue3';
import { watch } from 'vue';
import InputError from '@/components/InputError.vue';
import AppLayout from '@/layouts/AppLayout.vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Heading, Text } from '@/components/ui/typography';
import { dashboard } from '@/routes';
import { notify } from '@/composables/useNotify';
import type { BreadcrumbItem } from '@/types';

type HostingPlan = {
    id: number;
    name: string;
    price: string;
    config?: { memory?: number; disk?: number; cpu?: number };
};

type Props = {
    hostingPlans: HostingPlan[];
    selectedPlan: HostingPlan | null;
};

const props = defineProps<Props>();

const page = usePage();
watch(
    () => (page.props.flash as { error?: string; success?: string })?.error,
    (message) => {
        if (message) notify.error(message);
    },
    { immediate: true },
);
watch(
    () => (page.props.flash as { error?: string; success?: string })?.success,
    (message) => {
        if (message) notify.success(message);
    },
    { immediate: true },
);

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Game Server', href: '/gaming' },
    { title: 'Checkout', href: '#' },
];
</script>

<template>
    <AppLayout :breadcrumbs="breadcrumbs">
        <Head title="Game Server buchen" />

        <div class="space-y-6">
            <div>
                <Heading level="h1">Game Server buchen</Heading>
                <Text class="mt-2" muted>
                    Paket wählen und optional einen Namen für Ihren Server angeben
                </Text>
            </div>

            <Card class="max-w-xl">
                <CardHeader>
                    <CardTitle>Bestellung</CardTitle>
                    <CardDescription>Game-Server-Paket und optionaler Server-Name</CardDescription>
                </CardHeader>
                <Form
                    action="/gaming/checkout"
                    method="post"
                    class="space-y-6"
                    v-slot="{ errors, processing }"
                >
                    <CardContent class="space-y-4">
                        <div class="space-y-2">
                            <Label for="hosting_plan_id">Paket *</Label>
                            <select
                                id="hosting_plan_id"
                                name="hosting_plan_id"
                                required
                                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                :aria-invalid="!!errors.hosting_plan_id"
                            >
                                <option value="">Bitte wählen</option>
                                <option
                                    v-for="plan in props.hostingPlans"
                                    :key="plan.id"
                                    :value="plan.id"
                                    :selected="props.selectedPlan?.id === plan.id"
                                >
                                    {{ plan.name }} – {{ plan.price }} €/Monat
                                </option>
                            </select>
                            <InputError :message="errors.hosting_plan_id" />
                        </div>
                        <div class="space-y-2">
                            <Label for="server_name">Server-Name (optional)</Label>
                            <Input
                                id="server_name"
                                name="server_name"
                                type="text"
                                placeholder="Mein Minecraft Server"
                                :aria-invalid="!!errors.server_name"
                            />
                            <InputError :message="errors.server_name" />
                        </div>
                    </CardContent>
                    <CardFooter class="flex gap-2">
                        <Button type="submit" :disabled="processing">
                            {{ processing ? 'Wird weitergeleitet…' : 'Weiter zur Zahlung' }}
                        </Button>
                        <Link href="/gaming">
                            <Button type="button" variant="outline">Abbrechen</Button>
                        </Link>
                    </CardFooter>
                </Form>
            </Card>
        </div>
    </AppLayout>
</template>
