<script setup lang="ts">
import { Form, Head, Link, usePage } from '@inertiajs/vue3';
import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import DeleteUser from '@/components/DeleteUser.vue';
import InputError from '@/components/InputError.vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Heading, Text, Link as TypographyLink } from '@/components/ui/typography';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2, Mail } from 'lucide-vue-next';
import AppLayout from '@/layouts/AppLayout.vue';
import SettingsLayout from '@/layouts/settings/Layout.vue';
import { edit } from '@/routes/profile';
import { send } from '@/routes/verification';
import { type BreadcrumbItem } from '@/types';
import { Transition } from 'vue';

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
const user = page.props.auth.user;
</script>

<template>
    <AppLayout :breadcrumbs="breadcrumbItems">
        <Head title="Profileinstellungen" />

        <SettingsLayout>
            <div class="space-y-6">
                <div>
                    <Heading level="h1">Profilinformationen</Heading>
                    <Text class="mt-2" muted>
                        Aktualisieren Sie Ihren Namen und Ihre E-Mail-Adresse
                    </Text>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Persönliche Daten</CardTitle>
                        <CardDescription>Ihre Kontoinformationen</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form
                            v-bind="ProfileController.update.form()"
                            class="space-y-6"
                            v-slot="{ errors, processing, recentlySuccessful }"
                        >
                            <div class="space-y-2">
                                <Label for="name">Name</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    :default-value="user.name"
                                    required
                                    autocomplete="name"
                                    placeholder="Vollständiger Name"
                                    :aria-invalid="!!errors.name"
                                />
                                <InputError :message="errors.name" />
                            </div>

                            <div class="space-y-2">
                                <Label for="email">E-Mail-Adresse</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    :default-value="user.email"
                                    required
                                    autocomplete="username"
                                    placeholder="E-Mail-Adresse"
                                    :aria-invalid="!!errors.email"
                                />
                                <InputError :message="errors.email" />
                            </div>

                            <Alert
                                v-if="mustVerifyEmail && !user.email_verified_at"
                                variant="warning"
                            >
                                <Mail class="h-4 w-4" />
                                <AlertDescription>
                                    Ihre E-Mail-Adresse ist nicht verifiziert.
                                    <Link
                                        :href="send()"
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
                                <CheckCircle2 class="h-4 w-4" />
                                <AlertDescription>
                                    Ein neuer Verifizierungslink wurde an Ihre E-Mail-Adresse gesendet.
                                </AlertDescription>
                            </Alert>

                            <CardFooter class="px-0 pb-0">
                                <div class="flex items-center gap-4">
                                    <Button
                                        :disabled="processing"
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
                                            v-show="recentlySuccessful"
                                            variant="small"
                                            class="text-emerald-700 dark:text-emerald-400"
                                        >
                                            Gespeichert.
                                        </Text>
                                    </Transition>
                                </div>
                            </CardFooter>
                        </Form>
                    </CardContent>
                </Card>

                <DeleteUser />
            </div>
        </SettingsLayout>
    </AppLayout>
</template>
