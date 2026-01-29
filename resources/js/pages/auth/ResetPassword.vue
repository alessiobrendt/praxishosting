<script setup lang="ts">
import { Form, Head } from '@inertiajs/vue3';
import { ref } from 'vue';
import InputError from '@/components/InputError.vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/AuthLayout.vue';
import { update } from '@/routes/password';

const props = defineProps<{
    token: string;
    email: string;
}>();

const inputEmail = ref(props.email);
</script>

<template>
    <AuthLayout
        title="Passwort zurücksetzen"
        description="Bitte geben Sie Ihr neues Passwort ein"
    >
        <Head title="Passwort zurücksetzen" />

        <Form
            v-bind="update.form()"
            :transform="(data) => ({ ...data, token, email })"
            :reset-on-success="['password', 'password_confirmation']"
            v-slot="{ errors, processing }"
            class="space-y-6"
        >
            <div class="space-y-4">
                <div class="space-y-2">
                    <Label for="email">E-Mail</Label>
                    <Input
                        id="email"
                        type="email"
                        name="email"
                        autocomplete="email"
                        v-model="inputEmail"
                        readonly
                        :aria-invalid="!!errors.email"
                    />
                    <InputError :message="errors.email" />
                </div>

                <div class="space-y-2">
                    <Label for="password">Passwort</Label>
                    <Input
                        id="password"
                        type="password"
                        name="password"
                        autocomplete="new-password"
                        autofocus
                        placeholder="Passwort"
                        :aria-invalid="!!errors.password"
                    />
                    <InputError :message="errors.password" />
                </div>

                <div class="space-y-2">
                    <Label for="password_confirmation">
                        Passwort bestätigen
                    </Label>
                    <Input
                        id="password_confirmation"
                        type="password"
                        name="password_confirmation"
                        autocomplete="new-password"
                        placeholder="Passwort bestätigen"
                        :aria-invalid="!!errors.password_confirmation"
                    />
                    <InputError :message="errors.password_confirmation" />
                </div>

                <Button
                    type="submit"
                    class="w-full"
                    :disabled="processing"
                    data-test="reset-password-button"
                >
                    <Spinner v-if="processing" size="sm" class="mr-2" />
                    Passwort zurücksetzen
                </Button>
            </div>
        </Form>
    </AuthLayout>
</template>
