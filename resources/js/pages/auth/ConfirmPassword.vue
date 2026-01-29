<script setup lang="ts">
import { Form, Head } from '@inertiajs/vue3';
import InputError from '@/components/InputError.vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/AuthLayout.vue';
import { store } from '@/routes/password/confirm';
</script>

<template>
    <AuthLayout
        title="Passwort bestätigen"
        description="Dies ist ein sicherer Bereich der Anwendung. Bitte bestätigen Sie Ihr Passwort, bevor Sie fortfahren."
    >
        <Head title="Passwort bestätigen" />

        <Form
            v-bind="store.form()"
            reset-on-success
            v-slot="{ errors, processing }"
            class="space-y-6"
        >
            <div class="space-y-4">
                <div class="space-y-2">
                    <Label for="password">Passwort</Label>
                    <Input
                        id="password"
                        type="password"
                        name="password"
                        required
                        autocomplete="current-password"
                        autofocus
                        :aria-invalid="!!errors.password"
                    />
                    <InputError :message="errors.password" />
                </div>

                <Button
                    class="w-full"
                    :disabled="processing"
                    data-test="confirm-password-button"
                >
                    <Spinner v-if="processing" size="sm" class="mr-2" />
                    Passwort bestätigen
                </Button>
            </div>
        </Form>
    </AuthLayout>
</template>
