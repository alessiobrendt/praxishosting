<script setup lang="ts">
import { Form, Head } from '@inertiajs/vue3';
import InputError from '@/components/InputError.vue';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { Link as TypographyLink, Text } from '@/components/ui/typography';
import AuthBase from '@/layouts/AuthLayout.vue';
import AuthenticatedSessionController from '@/actions/Laravel/Fortify/Http/Controllers/AuthenticatedSessionController';
import { Alert, AlertDescription } from '@/components/ui/alert';

defineProps<{
    status?: string;
    canResetPassword: boolean;
    canRegister: boolean;
}>();
</script>

<template>
    <AuthBase
        title="Anmelden"
        description="Geben Sie Ihre E-Mail-Adresse und Ihr Passwort ein, um sich anzumelden"
    >
        <Head title="Anmelden" />

        <Alert v-if="status" variant="success" class="mb-6">
            <AlertDescription>{{ status }}</AlertDescription>
        </Alert>

        <Form
            :action="AuthenticatedSessionController.store.url()"
            method="post"
            :reset-on-success="['password']"
            v-slot="{ errors, processing }"
            class="space-y-6"
        >
            <div class="space-y-4">
                <div class="space-y-2">
                    <Label for="email">E-Mail-Adresse</Label>
                    <Input
                        id="email"
                        type="email"
                        name="email"
                        required
                        autofocus
                        :tabindex="1"
                        autocomplete="email"
                        placeholder="email@example.com"
                        :aria-invalid="!!errors.email"
                    />
                    <InputError :message="errors.email" />
                </div>

                <div class="space-y-2">
                    <div class="flex items-center justify-between">
                        <Label for="password">Passwort</Label>
                        <TypographyLink
                            v-if="canResetPassword"
                            href="/forgot-password"
                            variant="small"
                            :tabindex="5"
                        >
                            Passwort vergessen?
                        </TypographyLink>
                    </div>
                    <Input
                        id="password"
                        type="password"
                        name="password"
                        required
                        :tabindex="2"
                        autocomplete="current-password"
                        placeholder="Passwort"
                        :aria-invalid="!!errors.password"
                    />
                    <InputError :message="errors.password" />
                </div>

                <div class="flex items-center space-x-2">
                    <Checkbox id="remember" name="remember" :tabindex="3" />
                    <Label for="remember" class="text-sm font-normal cursor-pointer">
                        Angemeldet bleiben
                    </Label>
                </div>

                <Button
                    type="submit"
                    class="w-full"
                    :tabindex="4"
                    :disabled="processing"
                    data-test="login-button"
                >
                    <Spinner v-if="processing" size="sm" class="mr-2" />
                    Anmelden
                </Button>
            </div>

            <div
                v-if="canRegister"
                class="text-center text-sm"
            >
                <Text variant="small" muted>
                    Noch kein Konto?
                    <TypographyLink href="/register" :tabindex="5">Registrieren</TypographyLink>
                </Text>
            </div>
        </Form>
    </AuthBase>
</template>
