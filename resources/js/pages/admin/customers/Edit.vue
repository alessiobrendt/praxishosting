<script setup lang="ts">
import { Head, Link, useForm } from '@inertiajs/vue3';
import { computed } from 'vue';
import AppLayout from '@/layouts/AppLayout.vue';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Heading, Text } from '@/components/ui/typography';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import InputError from '@/components/InputError.vue';
import { index as customersIndex } from '@/routes/admin/customers';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';

type Customer = {
    id: number;
    name: string;
    email: string;
    company?: string | null;
    street?: string | null;
    postal_code?: string | null;
    city?: string | null;
    country?: string | null;
};

type Props = {
    customer: Customer;
    countries: Record<string, string>;
};

const props = defineProps<Props>();

const countryOptions = computed(() =>
    Object.entries(props.countries)
        .map(([code, name]) => ({ code, name }))
        .sort((a, b) => a.name.localeCompare(b.name, 'de')),
);

const form = useForm({
    name: props.customer.name,
    email: props.customer.email,
    company: props.customer.company ?? '',
    street: props.customer.street ?? '',
    postal_code: props.customer.postal_code ?? '',
    city: props.customer.city ?? '',
    country: props.customer.country ?? '',
});

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Kunden', href: customersIndex().url },
    { title: props.customer.name, href: `/admin/customers/${props.customer.id}` },
    { title: 'Bearbeiten', href: '#' },
];

function submit() {
    form.put(`/admin/customers/${props.customer.id}`);
}
</script>

<template>
    <AppLayout :breadcrumbs="breadcrumbs">
        <Head :title="`Kunde bearbeiten: ${customer.name}`" />

        <div class="space-y-6">
            <div>
                <Heading level="h1">Stammdaten bearbeiten</Heading>
                <Text class="mt-2" muted>
                    {{ customer.name }}
                </Text>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Kundendaten</CardTitle>
                    <CardDescription>Name, E-Mail, Firma, Adresse</CardDescription>
                </CardHeader>
                <CardContent>
                    <form class="space-y-4" @submit.prevent="submit">
                        <div class="space-y-2">
                            <Label for="name">Name</Label>
                            <Input
                                id="name"
                                v-model="form.name"
                                name="name"
                                required
                                :aria-invalid="!!form.errors.name"
                            />
                            <InputError :message="form.errors.name" />
                        </div>
                        <div class="space-y-2">
                            <Label for="email">E-Mail</Label>
                            <Input
                                id="email"
                                v-model="form.email"
                                type="email"
                                name="email"
                                required
                                :aria-invalid="!!form.errors.email"
                            />
                            <InputError :message="form.errors.email" />
                        </div>
                        <div class="space-y-2">
                            <Label for="company">Firma (optional)</Label>
                            <Input
                                id="company"
                                v-model="form.company"
                                name="company"
                                :aria-invalid="!!form.errors.company"
                            />
                            <InputError :message="form.errors.company" />
                        </div>
                        <div class="space-y-2">
                            <Label for="street">Straße (optional)</Label>
                            <Input
                                id="street"
                                v-model="form.street"
                                name="street"
                                :aria-invalid="!!form.errors.street"
                            />
                            <InputError :message="form.errors.street" />
                        </div>
                        <div class="grid gap-4 sm:grid-cols-2">
                            <div class="space-y-2">
                                <Label for="postal_code">PLZ (optional)</Label>
                                <Input
                                    id="postal_code"
                                    v-model="form.postal_code"
                                    name="postal_code"
                                    :aria-invalid="!!form.errors.postal_code"
                                />
                                <InputError :message="form.errors.postal_code" />
                            </div>
                            <div class="space-y-2">
                                <Label for="city">Ort (optional)</Label>
                                <Input
                                    id="city"
                                    v-model="form.city"
                                    name="city"
                                    :aria-invalid="!!form.errors.city"
                                />
                                <InputError :message="form.errors.city" />
                            </div>
                        </div>
                        <div class="space-y-2">
                            <Label for="country">Land (optional)</Label>
                            <Select
                                id="country"
                                v-model="form.country"
                                name="country"
                                :aria-invalid="!!form.errors.country"
                            >
                                <option value="">Bitte wählen</option>
                                <option
                                    v-for="c in countryOptions"
                                    :key="c.code"
                                    :value="c.code"
                                >
                                    {{ c.name }}
                                </option>
                            </Select>
                            <InputError :message="form.errors.country" />
                        </div>
                        <CardFooter class="flex flex-wrap gap-2 px-0 pb-0 pt-4">
                            <Button type="submit" :disabled="form.processing">Speichern</Button>
                            <Link :href="`/admin/customers/${customer.id}`">
                                <Button type="button" variant="outline">Abbrechen</Button>
                            </Link>
                        </CardFooter>
                    </form>
                </CardContent>
            </Card>
        </div>
    </AppLayout>
</template>
