<template>
    <div class="position-absolute top-0 end-0">
        <img src="/images/auth-card-bg.svg" class="auth-card-bg-img" alt="auth-card-bg" />
    </div>

    <div class="position-absolute start-0 bottom-0" style="transform: rotate(180deg)">
        <img src="/images/auth-card-bg.svg" class="auth-card-bg-img" alt="auth-card-bg" />
    </div>

    <div class="auth-box overflow-hidden align-items-center d-flex">
        <Head :title="loginTitle" />
        <BContainer>
            <BRow class="justify-content-center">
                <BCol xxl="5" md="6" sm="8">
                    <BCard no-body class="p-4">
                        <div class="auth-brand text-center mb-2">
                            <AuthLogo />
                            <h4 class="fw-bold text-dark mt-3">{{ loginTitle }}</h4>
                            <p class="text-muted w-lg-75 mx-auto">{{ loginDescription }}</p>
                        </div>

                        <BAlert v-if="status" variant="success" class="mb-3" show>
                            {{ status }}
                        </BAlert>
                        <BAlert v-if="error" variant="danger" class="mb-3" show>
                            {{ error }}
                        </BAlert>

                        <Form
                            :action="loginStore.url()"
                            method="post"
                            :reset-on-success="['password']"
                            v-slot="{ errors, processing }"
                        >
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

                                <div class="mb-3">
                                    <label for="password" class="form-label">
                                        Passwort <span class="text-danger">*</span>
                                    </label>
                                    <BFormInput
                                        id="password"
                                        type="password"
                                        name="password"
                                        required
                                        autocomplete="current-password"
                                        placeholder="••••••••"
                                        :class="{ 'is-invalid': errors.password }"
                                    />
                                    <div v-if="errors.password" class="invalid-feedback d-block">
                                        {{ errors.password }}
                                    </div>
                                </div>

                                <div class="d-flex justify-content-between align-items-center mb-3">
                                    <BFormCheckbox name="remember" value="1">
                                        Angemeldet bleiben
                                    </BFormCheckbox>
                                    <Link
                                        v-if="canResetPassword"
                                        href="/forgot-password"
                                        class="text-decoration-underline link-offset-3 text-muted"
                                    >
                                        Passwort vergessen?
                                    </Link>
                                </div>

                                <div class="d-grid">
                                    <BButton
                                        type="submit"
                                        variant="primary"
                                        class="fw-semibold py-2"
                                        :disabled="processing"
                                        data-test="login-button"
                                    >
                                        <BSpinner v-if="processing" small class="me-2" />
                                        Anmelden
                                    </BButton>
                                </div>
                        </Form>

                        <p v-if="canRegister && !isAdminDomain" class="text-muted text-center mt-4 mb-0">
                            Noch kein Konto?
                            <Link href="/register" class="text-decoration-underline link-offset-3 fw-semibold">
                                Registrieren
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
import { Form, Head, Link, usePage } from '@inertiajs/vue3';
import { computed } from 'vue';
import {
    BAlert,
    BButton,
    BCol,
    BContainer,
    BFormCheckbox,
    BFormInput,
    BRow,
    BCard,
    BSpinner,
} from 'bootstrap-vue-next';
import AuthLogo from '@/components/AuthLogo.vue';
import { currentYear, META_DATA } from '@/config/constants';
import AuthenticatedSessionController from '@/actions/Laravel/Fortify/Http/Controllers/AuthenticatedSessionController';

defineProps<{
    status?: string;
    error?: string;
    canResetPassword: boolean;
    canRegister: boolean;
}>();

const loginStore = AuthenticatedSessionController.store;

const page = usePage();
const isAdminDomain = computed(() => (page.props.isAdminDomain as boolean) ?? false);
const loginTitle = computed(() => (isAdminDomain.value ? 'Admin-Anmeldung' : 'Anmelden'));
const loginDescription = computed(() =>
    isAdminDomain.value
        ? 'Geben Sie Ihre E-Mail-Adresse und Ihr Passwort ein, um sich als Mitarbeiter zu verifizieren.'
        : 'Geben Sie Ihre E-Mail-Adresse und Ihr Passwort ein, um sich anzumelden.',
);
</script>
