<script setup lang="ts">
import { Form, Head, router } from '@inertiajs/vue3';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/AuthLayout.vue';
import { logout } from '@/routes';
import { send } from '@/routes/verification';

defineProps<{
    status?: string;
}>();
</script>

<template>
    <AuthLayout
        title="E-Mail verifizieren"
        description="Bitte verifizieren Sie Ihre E-Mail-Adresse, indem Sie auf den Link klicken, den wir Ihnen gerade per E-Mail gesendet haben."
    >
        <Head title="E-Mail-Verifizierung" />

        <Alert
            v-if="status === 'verification-link-sent'"
            variant="success"
            class="mb-6"
        >
            <AlertDescription>
                Ein neuer Verifizierungslink wurde an die E-Mail-Adresse gesendet, die Sie
                bei der Registrierung angegeben haben.
            </AlertDescription>
        </Alert>

        <div class="space-y-6 text-center">
            <Form
                v-bind="send.form()"
                class="space-y-6"
                v-slot="{ processing }"
            >
                <Button :disabled="processing" variant="outline" class="w-full">
                    <Spinner v-if="processing" size="sm" class="mr-2" />
                    Verifizierungs-E-Mail erneut senden
                </Button>

                <button
                    type="button"
                    class="block text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
                    @click="() => router.post(logout.url())"
                >
                    Abmelden
                </button>
            </Form>
        </div>
    </AuthLayout>
</template>
