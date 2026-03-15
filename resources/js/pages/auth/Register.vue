<template>
    <div class="position-absolute top-0 end-0">
        <img src="/images/auth-card-bg.svg" class="auth-card-bg-img" alt="auth-card-bg" />
    </div>

    <div class="position-absolute start-0 bottom-0" style="transform: rotate(180deg)">
        <img src="/images/auth-card-bg.svg" class="auth-card-bg-img" alt="auth-card-bg" />
    </div>

    <div class="auth-box overflow-hidden align-items-center d-flex">
        <Head title="Registrieren" />
        <BContainer>
            <BRow class="justify-content-center">
                <BCol xxl="5" md="6" sm="8">
                    <BCard no-body class="p-4">
                        <div class="auth-brand text-center mb-4">
                            <AuthLogo />
                            <h4 class="fw-bold text-dark mt-3">Konto erstellen</h4>
                            <p class="text-muted w-lg-75 mx-auto">
                                Geben Sie Ihre Daten ein, um ein Konto zu erstellen.
                            </p>
                        </div>

                        <Form
                            v-bind="register.store.form()"
                            :reset-on-success="['password', 'password_confirmation']"
                            v-slot="{ errors, processing }"
                        >
                            <div class="mb-3">
                                    <label for="name" class="form-label">
                                        Name <span class="text-danger">*</span>
                                    </label>
                                    <BFormInput
                                        id="name"
                                        type="text"
                                        name="name"
                                        required
                                        autofocus
                                        autocomplete="name"
                                        placeholder="Vollständiger Name"
                                        :class="{ 'is-invalid': errors.name }"
                                    />
                                    <div v-if="errors.name" class="invalid-feedback d-block">
                                        {{ errors.name }}
                                    </div>
                                </div>

                                <div class="mb-3">
                                    <label for="email" class="form-label">
                                        E-Mail-Adresse <span class="text-danger">*</span>
                                    </label>
                                    <BFormInput
                                        id="email"
                                        type="email"
                                        name="email"
                                        required
                                        autocomplete="email"
                                        placeholder="email@example.com"
                                        :class="{ 'is-invalid': errors.email }"
                                    />
                                    <div v-if="errors.email" class="invalid-feedback d-block">
                                        {{ errors.email }}
                                    </div>
                                </div>

                                <div class="mb-3">
                                    <label for="password" class="form-label">
                                        Passwort <span class="text-danger">*</span>
                                    </label>
                                    <BFormInput
                                        id="password"
                                        v-model="password"
                                        type="password"
                                        name="password"
                                        required
                                        autocomplete="new-password"
                                        placeholder="••••••••"
                                        :class="{ 'is-invalid': errors.password }"
                                    />
                                    <PasswordStrengthBar :password="password" />
                                    <div v-if="errors.password" class="invalid-feedback d-block">
                                        {{ errors.password }}
                                    </div>
                                </div>

                                <div class="mb-3">
                                    <label for="password_confirmation" class="form-label">
                                        Passwort bestätigen <span class="text-danger">*</span>
                                    </label>
                                    <BFormInput
                                        id="password_confirmation"
                                        type="password"
                                        name="password_confirmation"
                                        required
                                        autocomplete="new-password"
                                        placeholder="Passwort bestätigen"
                                        :class="{ 'is-invalid': errors.password_confirmation }"
                                    />
                                    <div v-if="errors.password_confirmation" class="invalid-feedback d-block">
                                        {{ errors.password_confirmation }}
                                    </div>
                                </div>

                                <div class="d-grid">
                                    <BButton
                                        type="submit"
                                        variant="primary"
                                        class="fw-semibold py-2"
                                        :disabled="processing"
                                        data-test="register-user-button"
                                    >
                                        <BSpinner v-if="processing" small class="me-2" />
                                        Konto erstellen
                                    </BButton>
                                </div>
                        </Form>

                        <p class="text-muted text-center mt-4 mb-0">
                            Bereits ein Konto?
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
import { ref } from 'vue';
import {
    BButton,
    BCol,
    BContainer,
    BFormInput,
    BRow,
    BCard,
    BSpinner,
} from 'bootstrap-vue-next';
import AuthLogo from '@/components/AuthLogo.vue';
import PasswordStrengthBar from '@/components/PasswordStrengthBar.vue';
import { currentYear, META_DATA } from '@/config/constants';
import register from '@/routes/register';

const password = ref('');
</script>
