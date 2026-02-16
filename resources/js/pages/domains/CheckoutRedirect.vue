<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3';
import AppLayout from '@/layouts/AppLayout.vue';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Heading, Text } from '@/components/ui/typography';
import { Button } from '@/components/ui/button';
import { dashboard } from '@/routes';

type Props = {
    token: string;
    stripeUrl: string;
    domain: string;
};

defineProps<Props>();

const breadcrumbs = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Domains', href: '/domains' },
    { title: 'Weiter zur Zahlung', href: '#' },
];

</script>

<template>
    <AppLayout :breadcrumbs="breadcrumbs">
        <Head :title="`Zahlung: ${domain}`" />

        <div class="space-y-6">
            <div>
                <Heading level="h1">Weiter zur Zahlung</Heading>
                <Text class="mt-2" muted>
                    Domain: {{ domain }}
                </Text>
            </div>

            <Card class="max-w-xl">
                <CardHeader>
                    <CardTitle>Lokal (Development)</CardTitle>
                    <CardDescription>
                        Ohne Webhook kannst du die Zahlung simulieren: Bestellung wird ausgeführt, ohne zu Stripe zu gehen.
                    </CardDescription>
                </CardHeader>
                <CardContent class="flex flex-col gap-3">
                    <Button
                        type="button"
                        variant="outline"
                        class="w-full sm:w-auto"
                        @click="() => (window.location.href = stripeUrl)"
                    >
                        Zu Stripe Checkout (echte Test-Zahlung)
                    </Button>
                    <Link :href="`/domains/checkout/dev-complete?token=${token}`">
                        <Button
                            type="button"
                            class="w-full sm:w-auto"
                        >
                            Dev: Zahlung simulieren (Domain jetzt bestellen)
                        </Button>
                    </Link>
                </CardContent>
            </Card>
        </div>
    </AppLayout>
</template>
