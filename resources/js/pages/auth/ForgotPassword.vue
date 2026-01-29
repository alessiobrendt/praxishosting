<script setup lang="ts">
import { Form, Head } from '@inertiajs/vue3';
import InputError from '@/components/InputError.vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { Link as TypographyLink, Text } from '@/components/ui/typography';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2 } from 'lucide-vue-next';
import AuthLayout from '@/layouts/AuthLayout.vue';
import { login } from '@/routes';
import { email } from '@/routes/password';

defineProps<{
    status?: string;
}>();
</script>

<template>
    <AuthLayout
        title="Passwort vergessen"
        description="Geben Sie Ihre E-Mail-Adresse ein, um einen Passwort-Reset-Link zu erhalten"
    >
        <Head title="Passwort vergessen" />

        <Alert v-if="status" variant="success" class="mb-6">
            <CheckCircle2 class="h-4 w-4" />
            <AlertDescription>{{ status }}</AlertDescription>
        </Alert>

        <div class="space-y-6">
            <Form v-bind="email.form()" v-slot="{ errors, processing }" class="space-y-4">
                <div class="space-y-2">
                    <Label for="email">E-Mail-Adresse</Label>
                    <Input
                        id="email"
                        type="email"
                        name="email"
                        autocomplete="off"
                        autofocus
                        placeholder="email@example.com"
                        :aria-invalid="!!errors.email"
                    />
                    <InputError :message="errors.email" />
                </div>

                <Button
                    class="w-full"
                    :disabled="processing"
                    data-test="email-password-reset-link-button"
                >
                    <Spinner v-if="processing" size="sm" class="mr-2" />
                    Passwort-Reset-Link senden
                </Button>
            </Form>

            <div class="text-center">
                <Text variant="small" muted>
                    Oder zurück zum
                    <TypographyLink :href="login()">Anmelden</TypographyLink>
                </Text>
            </div>
        </div>
    </AuthLayout>
</template>
