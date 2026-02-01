<script setup lang="ts">
import { Form, Head } from '@inertiajs/vue3';
import InputError from '@/components/InputError.vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { Link as TypographyLink, Text } from '@/components/ui/typography';
import AuthBase from '@/layouts/AuthLayout.vue';
import { store } from '@/routes/register';
</script>

<template>
    <AuthBase
        title="Konto erstellen"
        description="Geben Sie Ihre Daten ein, um ein Konto zu erstellen"
    >
        <Head title="Registrieren" />

        <Form
            v-bind="store.form()"
            :reset-on-success="['password', 'password_confirmation']"
            v-slot="{ errors, processing }"
            class="space-y-6"
        >
            <div class="space-y-4">
                <div class="space-y-2">
                    <Label for="name">Name</Label>
                    <Input
                        id="name"
                        type="text"
                        required
                        autofocus
                        :tabindex="1"
                        autocomplete="name"
                        name="name"
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
                        required
                        :tabindex="2"
                        autocomplete="email"
                        name="email"
                        placeholder="email@example.com"
                        :aria-invalid="!!errors.email"
                    />
                    <InputError :message="errors.email" />
                </div>

                <div class="space-y-2">
                    <Label for="password">Passwort</Label>
                    <Input
                        id="password"
                        type="password"
                        required
                        :tabindex="3"
                        autocomplete="new-password"
                        name="password"
                        placeholder="Passwort"
                        :aria-invalid="!!errors.password"
                    />
                    <InputError :message="errors.password" />
                </div>

                <div class="space-y-2">
                    <Label for="password_confirmation">Passwort bestätigen</Label>
                    <Input
                        id="password_confirmation"
                        type="password"
                        required
                        :tabindex="4"
                        autocomplete="new-password"
                        name="password_confirmation"
                        placeholder="Passwort bestätigen"
                        :aria-invalid="!!errors.password_confirmation"
                    />
                    <InputError :message="errors.password_confirmation" />
                </div>

                <Button
                    type="submit"
                    class="w-full"
                    tabindex="5"
                    :disabled="processing"
                    data-test="register-user-button"
                >
                    <Spinner v-if="processing" size="sm" class="mr-2" />
                    Konto erstellen
                </Button>
            </div>

            <div class="text-center">
                <Text variant="small" muted>
                    Bereits ein Konto?
                    <TypographyLink
                        href="/login"
                        :tabindex="6"
                    >
                        Anmelden
                    </TypographyLink>
                </Text>
            </div>
        </Form>
    </AuthBase>
</template>
