<script setup lang="ts">
import { Head, Link, useForm, usePage } from '@inertiajs/vue3';
import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import DeleteUser from '@/components/DeleteUser.vue';
import InputError from '@/components/InputError.vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { countriesSortedByName } from '@/lib/countries';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Heading, Text } from '@/components/ui/typography';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Mail } from 'lucide-vue-next';
import AppLayout from '@/layouts/AppLayout.vue';
import SettingsLayout from '@/layouts/settings/Layout.vue';
import { edit } from '@/routes/profile';
import { send } from '@/routes/verification';
import { type BreadcrumbItem } from '@/types';
import { Transition } from 'vue';
import { computed } from 'vue';

type Props = {
    mustVerifyEmail: boolean;
    status?: string;
};

defineProps<Props>();

const breadcrumbItems: BreadcrumbItem[] = [
    {
        title: 'Einstellungen',
        href: edit().url,
    },
];

const page = usePage();
const user = computed(() => page.props.auth?.user as Record<string, unknown> | undefined);

const form = useForm({
    name: (user.value?.name as string) ?? '',
    email: (user.value?.email as string) ?? '',
    company: (user.value?.company as string) ?? '',
    phone: (user.value?.phone as string) ?? '',
    street: (user.value?.street as string) ?? '',
    postal_code: (user.value?.postal_code as string) ?? '',
    city: (user.value?.city as string) ?? '',
    state: (user.value?.state as string) ?? '',
    country: (user.value?.country as string) ?? '',
    ticket_signature: (user.value?.ticket_signature as string) ?? '',
});

function submit() {
    form.patch(ProfileController.update.url());
}
</script>

<template>
    <AppLayout :breadcrumbs="breadcrumbItems">
        <Head title="Profileinstellungen" />

        <SettingsLayout>
            <div class="space-y-6">
                <div>
                    <Heading level="h1">Profilinformationen</Heading>
                    <Text class="mt-2" muted>
                        Aktualisieren Sie Ihren Namen, Ihre E-Mail-Adresse und Ihre Rechnungsadresse
                    </Text>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Persönliche Daten</CardTitle>
                        <CardDescription>Ihre Kontoinformationen</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form
                            class="space-y-6"
                            @submit.prevent="submit"
                        >
                            <div class="space-y-2">
                                <Label for="name">Name</Label>
                                <Input
                                    id="name"
                                    v-model="form.name"
                                    name="name"
                                    required
                                    autocomplete="name"
                                    placeholder="Vollständiger Name"
                                    :aria-invalid="!!form.errors.name"
                                />
                                <InputError :message="form.errors.name" />
                            </div>

                            <div class="space-y-2">
                                <Label for="email">E-Mail-Adresse</Label>
                                <Input
                                    id="email"
                                    v-model="form.email"
                                    type="email"
                                    name="email"
                                    required
                                    autocomplete="username"
                                    placeholder="E-Mail-Adresse"
                                    :aria-invalid="!!form.errors.email"
                                />
                                <InputError :message="form.errors.email" />
                            </div>

                            <div class="space-y-2">
                                <Label for="company">Unternehmen (optional)</Label>
                                <Input
                                    id="company"
                                    v-model="form.company"
                                    name="company"
                                    autocomplete="organization"
                                    placeholder="Firma / Unternehmen"
                                    :aria-invalid="!!form.errors.company"
                                />
                                <InputError :message="form.errors.company" />
                            </div>

                            <div class="space-y-2">
                                <Label for="phone">Telefonnummer</Label>
                                <Input
                                    id="phone"
                                    v-model="form.phone"
                                    name="phone"
                                    type="tel"
                                    autocomplete="tel"
                                    placeholder="z. B. +49 123 456789"
                                    :aria-invalid="!!form.errors.phone"
                                />
                                <InputError :message="form.errors.phone" />
                                <Text
                                    class="text-xs"
                                    muted
                                >
                                    Wird u. a. für Domain-Registrierung (WHOIS) benötigt. Format z. B. +49.123456789.
                                </Text>
                            </div>

                            <Alert
                                variant="info"
                                class="text-sm"
                            >
                                <AlertDescription>
                                    Für Rechnungen und den Abschluss von Bestellungen benötigen wir Ihre vollständige Rechnungsadresse (Straße, PLZ, Ort, Land).
                                </AlertDescription>
                            </Alert>

                            <div class="grid gap-4 sm:grid-cols-2">
                                <div class="space-y-2 sm:col-span-2">
                                    <Label for="street">Straße und Hausnummer</Label>
                                    <Input
                                        id="street"
                                        v-model="form.street"
                                        name="street"
                                        autocomplete="street-address"
                                        placeholder="Musterstraße 1"
                                        :aria-invalid="!!form.errors.street"
                                    />
                                    <InputError :message="form.errors.street" />
                                </div>
                                <div class="space-y-2">
                                    <Label for="postal_code">PLZ</Label>
                                    <Input
                                        id="postal_code"
                                        v-model="form.postal_code"
                                        name="postal_code"
                                        autocomplete="postal-code"
                                        placeholder="12345"
                                        :aria-invalid="!!form.errors.postal_code"
                                    />
                                    <InputError :message="form.errors.postal_code" />
                                </div>
                                <div class="space-y-2">
                                    <Label for="city">Ort</Label>
                                    <Input
                                        id="city"
                                        v-model="form.city"
                                        name="city"
                                        autocomplete="address-level2"
                                        placeholder="Stadt"
                                        :aria-invalid="!!form.errors.city"
                                    />
                                    <InputError :message="form.errors.city" />
                                </div>
                                <div class="space-y-2">
                                    <Label for="state">Bundesland / State</Label>
                                    <Input
                                        id="state"
                                        v-model="form.state"
                                        name="state"
                                        autocomplete="address-level1"
                                        placeholder="z. B. Bayern oder BY"
                                        :aria-invalid="!!form.errors.state"
                                    />
                                    <InputError :message="form.errors.state" />
                                    <Text
                                        class="text-xs"
                                        muted
                                    >
                                        Erforderlich für Domain-Registrierung (WHOIS).
                                    </Text>
                                </div>
                                <div class="space-y-2 sm:col-span-2">
                                    <Label for="country">Land</Label>
                                    <Select
                                        id="country"
                                        v-model="form.country"
                                        name="country"
                                        autocomplete="country-code"
                                        :aria-invalid="!!form.errors.country"
                                    >
                                        <option value="">Bitte wählen</option>
                                        <option
                                            v-for="c in countriesSortedByName"
                                            :key="c.code"
                                            :value="c.code"
                                        >
                                            {{ c.name }}
                                        </option>
                                    </Select>
                                    <InputError :message="form.errors.country" />
                                </div>
                            </div>

                            <div
                                v-if="user?.is_admin"
                                class="space-y-2 border-t border-border pt-6"
                            >
                                <Label for="ticket_signature">Signatur für Support-Tickets</Label>
                                <textarea
                                    id="ticket_signature"
                                    v-model="form.ticket_signature"
                                    name="ticket_signature"
                                    class="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    placeholder="Wird automatisch unter jeder Ihrer Ticket-Antworten eingefügt."
                                    :aria-invalid="!!form.errors.ticket_signature"
                                />
                                <InputError :message="form.errors.ticket_signature" />
                                <Text
                                    variant="small"
                                    class="text-muted-foreground"
                                >
                                    Nur für Mitarbeiter sichtbar. Wird unter jeder Ihrer Antworten im Support-Ticket-System angehängt.
                                </Text>
                            </div>

                            <Alert
                                v-if="mustVerifyEmail && !user?.email_verified_at"
                                variant="warning"
                            >
                                <Mail class="h-4 w-4" />
                                <AlertDescription>
                                    Ihre E-Mail-Adresse ist nicht verifiziert.
                                    <Link
                                        :href="send.url()"
                                        as="button"
                                        class="ml-1 font-medium underline"
                                    >
                                        Klicken Sie hier, um die Verifizierungs-E-Mail erneut zu senden.
                                    </Link>
                                </AlertDescription>
                            </Alert>

                            <Alert
                                v-if="status === 'verification-link-sent'"
                                variant="success"
                            >
                                <AlertDescription>
                                    Ein neuer Verifizierungslink wurde an Ihre E-Mail-Adresse gesendet.
                                </AlertDescription>
                            </Alert>

                            <CardFooter class="px-0 pb-0">
                                <div class="flex items-center gap-4">
                                    <Button
                                        type="submit"
                                        :disabled="form.processing"
                                        data-test="update-profile-button"
                                    >
                                        Speichern
                                    </Button>

                                    <Transition
                                        enter-active-class="transition ease-in-out"
                                        enter-from-class="opacity-0"
                                        leave-active-class="transition ease-in-out"
                                        leave-to-class="opacity-0"
                                    >
                                        <Text
                                            v-show="form.recentlySuccessful"
                                            variant="small"
                                            class="text-emerald-700 dark:text-emerald-400"
                                        >
                                            Gespeichert.
                                        </Text>
                                    </Transition>
                                </div>
                            </CardFooter>
                        </form>
                    </CardContent>
                </Card>

                <DeleteUser />
            </div>
        </SettingsLayout>
    </AppLayout>
</template>
