<template>
    <div class="position-absolute top-0 end-0">
        <img src="/images/auth-card-bg.svg" class="auth-card-bg-img" alt="auth-card-bg" />
    </div>

    <div class="position-absolute start-0 bottom-0" style="transform: rotate(180deg)">
        <img src="/images/auth-card-bg.svg" class="auth-card-bg-img" alt="auth-card-bg" />
    </div>

    <div class="auth-box overflow-hidden align-items-center d-flex">
        <Head title="Passwort vergessen" />
        <BContainer>
            <BRow class="justify-content-center">
                <BCol xxl="5" md="6" sm="8">
                    <BCard no-body class="p-4">
                        <div class="auth-brand text-center mb-4">
                            <AuthLogo />
                            <h4 class="fw-bold text-dark mt-3">Passwort vergessen</h4>
                            <p class="text-muted w-lg-75 mx-auto">
                                Geben Sie Ihre E-Mail-Adresse ein, um einen Passwort-Reset-Link zu erhalten.
                            </p>
                        </div>

                        <BAlert v-if="status" variant="success" class="mb-3" show>
                            {{ status }}
                        </BAlert>

                        <Form v-bind="password.email.form()" v-slot="{ errors, processing }">
                            <div class="mb-3">
                                    <label for="email" class="form-label">
                                        E-Mail-Adresse <span class="text-danger">*</span>
                                    </label>
                                    <BFormInput
                                        id="email"
                                        type="email"
                                        name="email"
                                        required
                                        autofocus
                                        autocomplete="email"
                                        placeholder="email@example.com"
                                        :class="{ 'is-invalid': errors.email }"
                                    />
                                    <div v-if="errors.email" class="invalid-feedback d-block">
                                        {{ errors.email }}
                                    </div>
                                </div>

                                <div class="d-grid">
                                    <BButton
                                        type="submit"
                                        variant="primary"
                                        class="fw-semibold py-2"
                                        :disabled="processing"
                                        data-test="email-password-reset-link-button"
                                    >
                                        <BSpinner v-if="processing" small class="me-2" />
                                        Passwort-Reset-Link senden
                                    </BButton>
                                </div>
                        </Form>

                        <p class="text-muted text-center mt-4 mb-0">
                            Oder zurück zum
                            <Link href="/login" class="text-decoration-underline link-offset-3 fw-semibold">
                                Anmelden
                            </Link>
                        </p>
                    </BCard>

                    <p class="text-center text-muted mt-4 mb-0">
                        © {{ currentYear }} {{ META_DATA.name }}
                        <span v-if="META_DATA.author"> — by <span class="fw-semibold">{{ META_DATA.author }}</span></span>
                    </p>
                </BCol>
            </BRow>
        </BContainer>
    </div>
</template>

<script setup lang="ts">
import { Form, Head, Link } from '@inertiajs/vue3';
import {
    BAlert,
    BButton,
    BCol,
    BContainer,
    BFormInput,
    BRow,
    BCard,
    BSpinner,
} from 'bootstrap-vue-next';
import AuthLogo from '@/components/AuthLogo.vue';
import { currentYear, META_DATA } from '@/config/constants';
import password from '@/routes/password';

defineProps<{
    status?: string;
}>();
</script>
