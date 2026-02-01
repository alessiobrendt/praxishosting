<script setup lang="ts">
import { Head, useForm } from '@inertiajs/vue3';
import AppLayout from '@/layouts/AppLayout.vue';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Heading, Text } from '@/components/ui/typography';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import InputError from '@/components/InputError.vue';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';
import { countriesSortedByName } from '@/lib/countries';

type Props = {
    settings: {
        app_name: string;
        billing_grace_period_days: string;
        pin_max_attempts: string;
        pin_lockout_minutes: string;
        inactivity_lock_default_minutes: string;
        invoice_ustg_19_text: string;
        invoice_company_name: string;
        invoice_company_street: string;
        invoice_company_postal_code: string;
        invoice_company_city: string;
        invoice_company_country: string;
        invoice_company_vat_id: string;
        invoice_company_logo: string;
        mail_from_name: string;
        mail_from_address: string;
        mail_reply_to_address: string;
        dunning_fee_level_1: string;
        dunning_fee_level_2: string;
        dunning_fee_level_3: string;
        domains_base_domain: string;
        main_app_hosts: string;
    };
};

const props = defineProps<Props>();

const form = useForm({
    app_name: props.settings.app_name,
    billing_grace_period_days: props.settings.billing_grace_period_days,
    pin_max_attempts: props.settings.pin_max_attempts,
    pin_lockout_minutes: props.settings.pin_lockout_minutes,
    inactivity_lock_default_minutes: props.settings.inactivity_lock_default_minutes,
    invoice_ustg_19_text: props.settings.invoice_ustg_19_text,
    invoice_company_name: props.settings.invoice_company_name,
    invoice_company_street: props.settings.invoice_company_street,
    invoice_company_postal_code: props.settings.invoice_company_postal_code,
    invoice_company_city: props.settings.invoice_company_city,
    invoice_company_country: props.settings.invoice_company_country,
    invoice_company_vat_id: props.settings.invoice_company_vat_id,
    invoice_company_logo: props.settings.invoice_company_logo,
    mail_from_name: props.settings.mail_from_name,
    mail_from_address: props.settings.mail_from_address,
    mail_reply_to_address: props.settings.mail_reply_to_address,
    dunning_fee_level_1: props.settings.dunning_fee_level_1,
    dunning_fee_level_2: props.settings.dunning_fee_level_2,
    dunning_fee_level_3: props.settings.dunning_fee_level_3,
});

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Admin', href: '/admin' },
    { title: 'Einstellungen', href: '#' },
];
</script>

<template>
    <AppLayout :breadcrumbs="breadcrumbs">
        <Head title="System-Einstellungen" />

        <div class="space-y-6">
            <div>
                <Heading level="h1">System-Einstellungen</Heading>
                <Text class="mt-2" muted>
                    Kulanzfrist, Rechnungssteller, Rechnungstexte (§ 19 UStG), Mail-Absender
                </Text>
            </div>

            <form @submit.prevent="form.put('/admin/settings')">
                <Tabs default-tab="allgemein" class="max-w-2xl">
                    <TabsList class="mb-4">
                        <TabsTrigger value="allgemein">Allgemein</TabsTrigger>
                        <TabsTrigger value="sicherheit">Sicherheit</TabsTrigger>
                        <TabsTrigger value="rechnung">Rechnung</TabsTrigger>
                        <TabsTrigger value="mahnung">Mahnung</TabsTrigger>
                        <TabsTrigger value="domains">Domains</TabsTrigger>
                        <TabsTrigger value="mail">Mail</TabsTrigger>
                    </TabsList>

                    <TabsContent value="allgemein">
                        <Card>
                            <CardHeader>
                                <CardTitle>Allgemein</CardTitle>
                                <CardDescription>Anzeigename der Anwendung, Abo-Logik und Kulanzfrist</CardDescription>
                            </CardHeader>
                            <CardContent class="space-y-6">
                                <div class="space-y-2">
                                    <Label for="app_name">Anzeigename der Anwendung</Label>
                                    <Input
                                        id="app_name"
                                        v-model="form.app_name"
                                        placeholder="z. B. Praxishosting"
                                        :aria-invalid="!!form.errors.app_name"
                                    />
                                    <InputError :message="form.errors.app_name" />
                                    <Text class="text-xs muted">Leer = Wert aus Konfiguration (APP_NAME). Wird in Header, E-Mails usw. verwendet.</Text>
                                </div>
                                <div class="space-y-2">
                                    <Label for="billing_grace_period_days">Kulanzfrist (Tage)</Label>
                                    <Input
                                        id="billing_grace_period_days"
                                        v-model="form.billing_grace_period_days"
                                        type="number"
                                        min="1"
                                        max="365"
                                        :aria-invalid="!!form.errors.billing_grace_period_days"
                                    />
                                    <InputError :message="form.errors.billing_grace_period_days" />
                                    <Text class="text-xs muted">Tage nach Abo-Ende, bis die Site endgültig gelöscht wird (davor: gesperrt).</Text>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button type="submit" :disabled="form.processing">Speichern</Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>

                    <TabsContent value="sicherheit">
                        <Card>
                            <CardHeader>
                                <CardTitle>Sicherheit</CardTitle>
                                <CardDescription>PIN-Sperre und Standard für Auto-Sperre nach Inaktivität</CardDescription>
                            </CardHeader>
                            <CardContent class="space-y-6">
                                <div class="space-y-2">
                                    <Label for="pin_max_attempts">PIN – maximale Versuche</Label>
                                    <Input
                                        id="pin_max_attempts"
                                        v-model="form.pin_max_attempts"
                                        type="number"
                                        min="1"
                                        max="20"
                                        :aria-invalid="!!form.errors.pin_max_attempts"
                                    />
                                    <InputError :message="form.errors.pin_max_attempts" />
                                    <Text class="text-xs muted">Anzahl falscher PIN-Eingaben bis zur Sperre.</Text>
                                </div>
                                <div class="space-y-2">
                                    <Label for="pin_lockout_minutes">PIN – Sperrdauer (Minuten)</Label>
                                    <Input
                                        id="pin_lockout_minutes"
                                        v-model="form.pin_lockout_minutes"
                                        type="number"
                                        min="1"
                                        max="120"
                                        :aria-invalid="!!form.errors.pin_lockout_minutes"
                                    />
                                    <InputError :message="form.errors.pin_lockout_minutes" />
                                    <Text class="text-xs muted">Dauer der Sperre nach zu vielen Fehlversuchen.</Text>
                                </div>
                                <div class="space-y-2">
                                    <Label for="inactivity_lock_default_minutes">Inaktivität – Standard (Minuten)</Label>
                                    <Input
                                        id="inactivity_lock_default_minutes"
                                        v-model="form.inactivity_lock_default_minutes"
                                        type="number"
                                        min="0"
                                        max="1440"
                                        :aria-invalid="!!form.errors.inactivity_lock_default_minutes"
                                    />
                                    <InputError :message="form.errors.inactivity_lock_default_minutes" />
                                    <Text class="text-xs muted">Standardwert für „Auto-Sperre nach Inaktivität“ (0 = deaktiviert). Nutzer können unter Einstellungen abweichen.</Text>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button type="submit" :disabled="form.processing">Speichern</Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>

                    <TabsContent value="rechnung">
                        <Card>
                            <CardHeader>
                                <CardTitle>Rechnung</CardTitle>
                                <CardDescription>Rechnungssteller und § 19 UStG-Text für PDF/E-Rechnung</CardDescription>
                            </CardHeader>
                            <CardContent class="space-y-6">
                                <div class="space-y-2">
                                    <Label for="invoice_ustg_19_text">§ 19 UStG-Text (Rechnung)</Label>
                                    <Textarea
                                        id="invoice_ustg_19_text"
                                        v-model="form.invoice_ustg_19_text"
                                        rows="3"
                                        :aria-invalid="!!form.errors.invoice_ustg_19_text"
                                    />
                                    <InputError :message="form.errors.invoice_ustg_19_text" />
                                </div>
                                <div class="border-t border-border pt-6 space-y-4">
                                    <Heading level="h3" class="text-base">Rechnungssteller</Heading>
                                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div class="sm:col-span-2 space-y-2">
                                            <Label for="invoice_company_logo">Firmenlogo (URL oder Pfad)</Label>
                                            <Input
                                                id="invoice_company_logo"
                                                v-model="form.invoice_company_logo"
                                                placeholder="https://… oder invoices/logo.png"
                                                :aria-invalid="!!form.errors.invoice_company_logo"
                                            />
                                            <InputError :message="form.errors.invoice_company_logo" />
                                            <Text class="text-xs muted">Vollständige URL oder Pfad unter storage/app/public (z. B. invoices/logo.png).</Text>
                                        </div>
                                        <div class="sm:col-span-2 space-y-2">
                                            <Label for="invoice_company_name">Firma / Name</Label>
                                            <Input
                                                id="invoice_company_name"
                                                v-model="form.invoice_company_name"
                                                :aria-invalid="!!form.errors.invoice_company_name"
                                            />
                                            <InputError :message="form.errors.invoice_company_name" />
                                        </div>
                                        <div class="sm:col-span-2 space-y-2">
                                            <Label for="invoice_company_street">Straße, Hausnummer</Label>
                                            <Input
                                                id="invoice_company_street"
                                                v-model="form.invoice_company_street"
                                                :aria-invalid="!!form.errors.invoice_company_street"
                                            />
                                            <InputError :message="form.errors.invoice_company_street" />
                                        </div>
                                        <div class="space-y-2">
                                            <Label for="invoice_company_postal_code">PLZ</Label>
                                            <Input
                                                id="invoice_company_postal_code"
                                                v-model="form.invoice_company_postal_code"
                                                :aria-invalid="!!form.errors.invoice_company_postal_code"
                                            />
                                            <InputError :message="form.errors.invoice_company_postal_code" />
                                        </div>
                                        <div class="space-y-2">
                                            <Label for="invoice_company_city">Ort</Label>
                                            <Input
                                                id="invoice_company_city"
                                                v-model="form.invoice_company_city"
                                                :aria-invalid="!!form.errors.invoice_company_city"
                                            />
                                            <InputError :message="form.errors.invoice_company_city" />
                                        </div>
                                        <div class="space-y-2">
                                            <Label for="invoice_company_country">Land</Label>
                                            <Select
                                                id="invoice_company_country"
                                                v-model="form.invoice_company_country"
                                                :aria-invalid="!!form.errors.invoice_company_country"
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
                                            <InputError :message="form.errors.invoice_company_country" />
                                        </div>
                                        <div class="space-y-2">
                                            <Label for="invoice_company_vat_id">USt-IdNr.</Label>
                                            <Input
                                                id="invoice_company_vat_id"
                                                v-model="form.invoice_company_vat_id"
                                                placeholder="DE123456789"
                                                :aria-invalid="!!form.errors.invoice_company_vat_id"
                                            />
                                            <InputError :message="form.errors.invoice_company_vat_id" />
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button type="submit" :disabled="form.processing">Speichern</Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>

                    <TabsContent value="mahnung">
                        <Card>
                            <CardHeader>
                                <CardTitle>Mahnung</CardTitle>
                                <CardDescription>Mahngebühren in Euro für 1., 2. und 3. Mahnung</CardDescription>
                            </CardHeader>
                            <CardContent class="space-y-6">
                                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div class="space-y-2">
                                        <Label for="dunning_fee_level_1">1. Mahnung (€)</Label>
                                        <Input
                                            id="dunning_fee_level_1"
                                            v-model="form.dunning_fee_level_1"
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            :aria-invalid="!!form.errors.dunning_fee_level_1"
                                        />
                                        <InputError :message="form.errors.dunning_fee_level_1" />
                                    </div>
                                    <div class="space-y-2">
                                        <Label for="dunning_fee_level_2">2. Mahnung (€)</Label>
                                        <Input
                                            id="dunning_fee_level_2"
                                            v-model="form.dunning_fee_level_2"
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            :aria-invalid="!!form.errors.dunning_fee_level_2"
                                        />
                                        <InputError :message="form.errors.dunning_fee_level_2" />
                                    </div>
                                    <div class="space-y-2">
                                        <Label for="dunning_fee_level_3">3. Mahnung (€)</Label>
                                        <Input
                                            id="dunning_fee_level_3"
                                            v-model="form.dunning_fee_level_3"
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            :aria-invalid="!!form.errors.dunning_fee_level_3"
                                        />
                                        <InputError :message="form.errors.dunning_fee_level_3" />
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button type="submit" :disabled="form.processing">Speichern</Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>

                    <TabsContent value="domains">
                        <Card>
                            <CardHeader>
                                <CardTitle>Domains</CardTitle>
                                <CardDescription>Basis-Domain für CNAME, Hosts der Haupt-App (Dashboard)</CardDescription>
                            </CardHeader>
                            <CardContent class="space-y-6">
                                <div class="space-y-2">
                                    <Label for="domains_base_domain">Basis-Domain</Label>
                                    <Input
                                        id="domains_base_domain"
                                        v-model="form.domains_base_domain"
                                        placeholder="z. B. praxishosting.abrendt.de"
                                        :aria-invalid="!!form.errors.domains_base_domain"
                                    />
                                    <InputError :message="form.errors.domains_base_domain" />
                                    <Text class="text-xs muted">Domain, auf die Custom-Domains per CNAME zeigen. Leer = Wert aus Konfiguration.</Text>
                                </div>
                                <div class="space-y-2">
                                    <Label for="main_app_hosts">Haupt-App-Hosts (kommagetrennt)</Label>
                                    <Input
                                        id="main_app_hosts"
                                        v-model="form.main_app_hosts"
                                        placeholder="z. B. app.example.com, localhost"
                                        :aria-invalid="!!form.errors.main_app_hosts"
                                    />
                                    <InputError :message="form.errors.main_app_hosts" />
                                    <Text class="text-xs muted">Hosts, unter denen die Haupt-App (Dashboard, Login) läuft. Alle anderen Hosts = Site-Render. Leer = Wert aus Konfiguration.</Text>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button type="submit" :disabled="form.processing">Speichern</Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>

                    <TabsContent value="mail">
                        <Card>
                            <CardHeader>
                                <CardTitle>Mail</CardTitle>
                                <CardDescription>Absender für System-E-Mails</CardDescription>
                            </CardHeader>
                            <CardContent class="space-y-6">
                                <div class="space-y-2">
                                    <Label for="mail_from_name">Mail-Absender Name</Label>
                                    <Input
                                        id="mail_from_name"
                                        v-model="form.mail_from_name"
                                        :aria-invalid="!!form.errors.mail_from_name"
                                    />
                                    <InputError :message="form.errors.mail_from_name" />
                                </div>
                                <div class="space-y-2">
                                    <Label for="mail_from_address">Mail-Absender E-Mail</Label>
                                    <Input
                                        id="mail_from_address"
                                        v-model="form.mail_from_address"
                                        type="email"
                                        :aria-invalid="!!form.errors.mail_from_address"
                                    />
                                    <InputError :message="form.errors.mail_from_address" />
                                </div>
                                <div class="space-y-2">
                                    <Label for="mail_reply_to_address">Reply-To Adresse (optional)</Label>
                                    <Input
                                        id="mail_reply_to_address"
                                        v-model="form.mail_reply_to_address"
                                        type="email"
                                        placeholder="z. B. support@example.com"
                                        :aria-invalid="!!form.errors.mail_reply_to_address"
                                    />
                                    <InputError :message="form.errors.mail_reply_to_address" />
                                    <Text class="text-xs muted">Falls gesetzt, wird bei allen System-E-Mails diese Adresse als Reply-To gesetzt.</Text>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button type="submit" :disabled="form.processing">Speichern</Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>
                </Tabs>
            </form>
        </div>
    </AppLayout>
</template>
