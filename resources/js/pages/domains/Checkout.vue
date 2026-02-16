<script setup lang="ts">
import { Head, useForm, usePage } from '@inertiajs/vue3';
import { watch } from 'vue';
import AppLayout from '@/layouts/AppLayout.vue';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Heading, Text } from '@/components/ui/typography';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/InputError.vue';
import { notify } from '@/composables/useNotify';
import { dashboard } from '@/routes';

type Contact = {
    firstname: string;
    lastname: string;
    street: string;
    number: string;
    postcode: string;
    city: string;
    state: string;
    country: string;
    email: string;
    phone: string;
    company?: string;
};

type Props = {
    domain: string;
    sale_price: number;
    tld: string;
    profile_contact: Contact;
};

const props = defineProps<Props>();

const form = useForm({
    domain: props.domain,
    sale_price: props.sale_price,
    purchase_price: 0,
    tld: props.tld,
    use_profile_contact: true,
    contact: {
        firstname: props.profile_contact.firstname,
        lastname: props.profile_contact.lastname,
        street: props.profile_contact.street,
        number: props.profile_contact.number,
        postcode: props.profile_contact.postcode,
        city: props.profile_contact.city,
        state: props.profile_contact.state,
        country: props.profile_contact.country,
        email: props.profile_contact.email,
        phone: props.profile_contact.phone,
        company: props.profile_contact.company ?? '',
    },
});

const page = usePage();
watch(
    () => (page.props.flash as { error?: string })?.error,
    (message) => {
        if (message) {
            notify.error(message);
        }
    },
    { immediate: true },
);

const breadcrumbs = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Domains', href: '/domains' },
    { title: 'Domain bestellen', href: '#' },
];

function submit() {
    form.post('/domains/checkout');
}
</script>

<template>
    <AppLayout :breadcrumbs="breadcrumbs">
        <Head :title="`Domain bestellen: ${domain}`" />

        <div class="space-y-6">
            <div>
                <Heading level="h1">Domain bestellen</Heading>
                <Text class="mt-2" muted>
                    {{ domain }} – {{ sale_price.toFixed(2) }} € (inkl. Registrierung)
                </Text>
            </div>

            <form @submit.prevent="submit">
                <input v-model="form.domain" type="hidden" />
                <input v-model="form.sale_price" type="hidden" />
                <input v-model="form.tld" type="hidden" />

                <Card>
                    <CardHeader>
                        <CardTitle>Kontaktdaten für die Domain-Registrierung</CardTitle>
                        <CardDescription>
                            Diese Daten werden an den Registrar (Skrime) übermittelt (WHOIS).
                        </CardDescription>
                    </CardHeader>
                    <CardContent class="space-y-6">
                        <div class="flex gap-4">
                            <label class="flex items-center gap-2 cursor-pointer">
                                <input
                                    v-model="form.use_profile_contact"
                                    type="radio"
                                    :value="true"
                                />
                                <span>Adresse aus meinem Profil verwenden</span>
                            </label>
                            <label class="flex items-center gap-2 cursor-pointer">
                                <input
                                    v-model="form.use_profile_contact"
                                    type="radio"
                                    :value="false"
                                />
                                <span>Andere Kontaktdaten angeben</span>
                            </label>
                        </div>

                        <div v-if="!form.use_profile_contact" class="grid gap-4 sm:grid-cols-2">
                            <div class="space-y-2">
                                <Label for="firstname">Vorname</Label>
                                <Input id="firstname" v-model="form.contact.firstname" />
                                <InputError :message="form.errors['contact.firstname']" />
                            </div>
                            <div class="space-y-2">
                                <Label for="lastname">Nachname</Label>
                                <Input id="lastname" v-model="form.contact.lastname" />
                                <InputError :message="form.errors['contact.lastname']" />
                            </div>
                            <div class="space-y-2 sm:col-span-2">
                                <Label for="street">Straße</Label>
                                <Input id="street" v-model="form.contact.street" />
                                <InputError :message="form.errors['contact.street']" />
                            </div>
                            <div class="space-y-2">
                                <Label for="number">Hausnummer</Label>
                                <Input id="number" v-model="form.contact.number" />
                                <InputError :message="form.errors['contact.number']" />
                            </div>
                            <div class="space-y-2">
                                <Label for="postcode">PLZ</Label>
                                <Input id="postcode" v-model="form.contact.postcode" />
                                <InputError :message="form.errors['contact.postcode']" />
                            </div>
                            <div class="space-y-2">
                                <Label for="city">Ort</Label>
                                <Input id="city" v-model="form.contact.city" />
                                <InputError :message="form.errors['contact.city']" />
                            </div>
                            <div class="space-y-2">
                                <Label for="state">Bundesland / State</Label>
                                <Input
                                    id="state"
                                    v-model="form.contact.state"
                                    placeholder="z. B. Bayern"
                                />
                                <InputError :message="form.errors['contact.state']" />
                            </div>
                            <div class="space-y-2">
                                <Label for="country">Land (ISO 2)</Label>
                                <Input id="country" v-model="form.contact.country" placeholder="DE" />
                                <InputError :message="form.errors['contact.country']" />
                            </div>
                            <div class="space-y-2">
                                <Label for="email">E-Mail</Label>
                                <Input id="email" v-model="form.contact.email" type="email" />
                                <InputError :message="form.errors['contact.email']" />
                            </div>
                            <div class="space-y-2">
                                <Label for="phone">Telefon</Label>
                                <Input id="phone" v-model="form.contact.phone" />
                                <InputError :message="form.errors['contact.phone']" />
                            </div>
                            <div class="space-y-2 sm:col-span-2">
                                <Label for="company">Firma (optional)</Label>
                                <Input id="company" v-model="form.contact.company" />
                            </div>
                        </div>

                        <div class="pt-4">
                            <Button type="submit" :disabled="form.processing">
                                Weiter zur Zahlung (Stripe)
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </form>
        </div>
    </AppLayout>
</template>
