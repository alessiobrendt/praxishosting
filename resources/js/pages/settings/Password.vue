<script setup lang="ts">
import { Form, Head } from '@inertiajs/vue3';
import PasswordController from '@/actions/App/Http/Controllers/Settings/PasswordController';
import InputError from '@/components/InputError.vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Heading, Text } from '@/components/ui/typography';
import AppLayout from '@/layouts/AppLayout.vue';
import SettingsLayout from '@/layouts/settings/Layout.vue';
import { edit } from '@/routes/user-password';
import { type BreadcrumbItem } from '@/types';
import { Transition } from 'vue';

const breadcrumbItems: BreadcrumbItem[] = [
    {
        title: 'Einstellungen',
        href: edit().url,
    },
];
</script>

<template>
    <AppLayout :breadcrumbs="breadcrumbItems">
        <Head title="Passwort-Einstellungen" />

        <SettingsLayout>
            <div class="space-y-6">
                <div>
                    <Heading level="h1">Passwort aktualisieren</Heading>
                    <Text class="mt-2" muted>
                        Stellen Sie sicher, dass Ihr Konto ein langes, zufälliges Passwort verwendet, um sicher zu bleiben
                    </Text>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Passwort ändern</CardTitle>
                        <CardDescription>Geben Sie Ihr aktuelles und neues Passwort ein</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form
                            v-bind="PasswordController.update.form()"
                            :options="{
                                preserveScroll: true,
                            }"
                            reset-on-success
                            :reset-on-error="[
                                'password',
                                'password_confirmation',
                                'current_password',
                            ]"
                            class="space-y-6"
                            v-slot="{ errors, processing, recentlySuccessful }"
                        >
                            <div class="space-y-2">
                                <Label for="current_password">Aktuelles Passwort</Label>
                                <Input
                                    id="current_password"
                                    name="current_password"
                                    type="password"
                                    autocomplete="current-password"
                                    placeholder="Aktuelles Passwort"
                                    :aria-invalid="!!errors.current_password"
                                />
                                <InputError :message="errors.current_password" />
                            </div>

                            <div class="space-y-2">
                                <Label for="password">Neues Passwort</Label>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autocomplete="new-password"
                                    placeholder="Neues Passwort"
                                    :aria-invalid="!!errors.password"
                                />
                                <InputError :message="errors.password" />
                            </div>

                            <div class="space-y-2">
                                <Label for="password_confirmation">Passwort bestätigen</Label>
                                <Input
                                    id="password_confirmation"
                                    name="password_confirmation"
                                    type="password"
                                    autocomplete="new-password"
                                    placeholder="Passwort bestätigen"
                                    :aria-invalid="!!errors.password_confirmation"
                                />
                                <InputError :message="errors.password_confirmation" />
                            </div>

                            <CardFooter class="px-0 pb-0">
                                <div class="flex items-center gap-4">
                                    <Button
                                        :disabled="processing"
                                        data-test="update-password-button"
                                    >
                                        Passwort speichern
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
            </div>
        </SettingsLayout>
    </AppLayout>
</template>
