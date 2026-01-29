<script setup lang="ts">
import { Form, Head } from '@inertiajs/vue3';
import { computed, ref } from 'vue';
import InputError from '@/components/InputError.vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from '@/components/ui/input-otp';
import { Link as TypographyLink, Text } from '@/components/ui/typography';
import AuthLayout from '@/layouts/AuthLayout.vue';
import { store } from '@/routes/two-factor/login';
import type { TwoFactorConfigContent } from '@/types';

const authConfigContent = computed<TwoFactorConfigContent>(() => {
    if (showRecoveryInput.value) {
        return {
            title: 'Wiederherstellungscode',
            description:
                'Bitte bestätigen Sie den Zugriff auf Ihr Konto, indem Sie einen Ihrer Notfall-Wiederherstellungscodes eingeben.',
            buttonText: 'mit einem Authentifizierungscode anmelden',
        };
    }

    return {
        title: 'Authentifizierungscode',
        description:
            'Geben Sie den Authentifizierungscode ein, den Ihre Authenticator-App bereitstellt.',
        buttonText: 'mit einem Wiederherstellungscode anmelden',
    };
});

const showRecoveryInput = ref<boolean>(false);

const toggleRecoveryMode = (clearErrors: () => void): void => {
    showRecoveryInput.value = !showRecoveryInput.value;
    clearErrors();
    code.value = '';
};

const code = ref<string>('');
</script>

<template>
    <AuthLayout
        :title="authConfigContent.title"
        :description="authConfigContent.description"
    >
        <Head title="Zwei-Faktor-Authentifizierung" />

        <div class="space-y-6">
            <template v-if="!showRecoveryInput">
                <Form
                    v-bind="store.form()"
                    class="space-y-4"
                    reset-on-error
                    @error="code = ''"
                    #default="{ errors, processing, clearErrors }"
                >
                    <input type="hidden" name="code" :value="code" />
                    <div
                        class="flex flex-col items-center justify-center space-y-3 text-center"
                    >
                        <div class="flex w-full items-center justify-center">
                            <InputOTP
                                id="otp"
                                v-model="code"
                                :maxlength="6"
                                :disabled="processing"
                                autofocus
                            >
                                <InputOTPGroup>
                                    <InputOTPSlot
                                        v-for="index in 6"
                                        :key="index"
                                        :index="index - 1"
                                    />
                                </InputOTPGroup>
                            </InputOTP>
                        </div>
                        <InputError :message="errors.code" />
                    </div>
                    <Button type="submit" class="w-full" :disabled="processing">
                        Fortfahren
                    </Button>
                    <div class="text-center">
                        <Text variant="small" muted>
                            oder Sie können
                            <button
                                type="button"
                                class="ml-1 font-medium underline"
                                @click="() => toggleRecoveryMode(clearErrors)"
                            >
                                {{ authConfigContent.buttonText }}
                            </button>
                        </Text>
                    </div>
                </Form>
            </template>

            <template v-else>
                <Form
                    v-bind="store.form()"
                    class="space-y-4"
                    reset-on-error
                    #default="{ errors, processing, clearErrors }"
                >
                    <div class="space-y-2">
                        <Input
                            name="recovery_code"
                            type="text"
                            placeholder="Wiederherstellungscode eingeben"
                            :autofocus="showRecoveryInput"
                            required
                            :aria-invalid="!!errors.recovery_code"
                        />
                        <InputError :message="errors.recovery_code" />
                    </div>
                    <Button type="submit" class="w-full" :disabled="processing">
                        Fortfahren
                    </Button>

                    <div class="text-center">
                        <Text variant="small" muted>
                            oder Sie können
                            <button
                                type="button"
                                class="ml-1 font-medium underline"
                                @click="() => toggleRecoveryMode(clearErrors)"
                            >
                                {{ authConfigContent.buttonText }}
                            </button>
                        </Text>
                    </div>
                </Form>
            </template>
        </div>
    </AuthLayout>
</template>
