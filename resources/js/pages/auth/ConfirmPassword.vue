<template>
    <div class="position-absolute top-0 end-0">
        <img src="/images/auth-card-bg.svg" class="auth-card-bg-img" alt="auth-card-bg" />
    </div>
    <div class="position-absolute start-0 bottom-0" style="transform: rotate(180deg)">
        <img src="/images/auth-card-bg.svg" class="auth-card-bg-img" alt="auth-card-bg" />
    </div>
    <div class="auth-box overflow-hidden align-items-center d-flex">
        <Head title="Passwort bestätigen" />
        <BContainer>
            <BRow class="justify-content-center">
                <BCol xxl="5" md="6" sm="8">
                    <BCard no-body class="p-4">
                        <div class="auth-brand text-center mb-4">
                            <AuthLogo />
                            <h4 class="fw-bold text-dark mt-3">Passwort bestätigen</h4>
                            <p class="text-muted w-lg-75 mx-auto">
                                Dies ist ein sicherer Bereich. Bitte bestätigen Sie Ihr Passwort, bevor Sie fortfahren.
                            </p>
                        </div>
                        <Form v-bind="confirmStore.form()" reset-on-success v-slot="{ errors, processing }">
                            <div class="mb-3">
                                <label for="password" class="form-label">Passwort <span class="text-danger">*</span></label>
                                <BFormInput
                                    id="password"
                                    type="password"
                                    name="password"
                                    required
                                    autocomplete="current-password"
                                    autofocus
                                    :class="{ 'is-invalid': errors.password }"
                                />
                                <div v-if="errors.password" class="invalid-feedback d-block">{{ errors.password }}</div>
                            </div>
                            <div class="d-grid">
                                <BButton type="submit" variant="primary" class="fw-semibold py-2" :disabled="processing">
                                    <BSpinner v-if="processing" small class="me-2" />
                                    Passwort bestätigen
                                </BButton>
                            </div>
                        </Form>
                        <p class="text-muted text-center mt-4 mb-0">
                            <Link href="/login" class="text-decoration-underline link-offset-3 fw-semibold">Zurück zur Anmeldung</Link>
                        </p>
                    </BCard>
                </BCol>
            </BRow>
        </BContainer>
    </div>
</template>

<script setup lang="ts">
import { Form, Head, Link } from '@inertiajs/vue3';
import { BContainer, BRow, BCol, BCard, BFormInput, BButton, BSpinner } from 'bootstrap-vue-next';
import AuthLogo from '@/components/AuthLogo.vue';
import { store as confirmStore } from '@/routes/password/confirm';
</script>
