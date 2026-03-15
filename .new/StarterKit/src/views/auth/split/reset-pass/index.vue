<template>
  <div class="auth-box p-0 w-100">
    <BRow class="w-100 g-0">
      <BCol xl="auto">
        <BCard no-body class="auth-box-form border-0 mb-0">
          <div class="position-absolute top-0 end-0" style="width: 180px">
            <img src="/images/auth-card-bg.svg" class="auth-card-bg-img" alt="auth-card-bg" />
          </div>
          <BCardBody class="min-vh-100 position-relative d-flex flex-column justify-content-center">
            <div class="auth-brand mb-0 text-center">
              <AuthLogo />
            </div>

            <div class="mt-auto">
              <p class="text-muted text-center auth-sub-text mx-auto">Enter your email address and we'll send you a link to reset your password.</p>

              <BForm class="mt-4">
                <div class="mb-3">
                  <label for="userEmail" class="form-label">
                    Email address
                    <span class="text-danger">*</span>
                  </label>
                  <div class="app-search">
                    <BFormInput type="email" placeholder="Enter email" required />
                    <Icon icon="mail" class="app-search-icon text-muted" />
                  </div>
                </div>

                <div class="d-flex justify-content-between align-items-center mb-3">
                  <BFormCheckbox name="termAndPolicy"> Agree the Terms & Policy </BFormCheckbox>
                </div>

                <div class="d-grid">
                  <BButton variant="primary" type="submit" class="fw-semibold py-2">Send Request </BButton>
                </div>
              </BForm>
            </div>

            <p class="text-muted text-center mt-4 mb-0">
              Return to
              <RouterLink to="/auth/split/sign-in" class="text-decoration-underline link-offset-3 fw-semibold"> Sign in </RouterLink>
            </p>

            <p class="text-center text-muted mt-auto mb-0">
              © {{ currentYear }} {{ META_DATA.name }} — by <span class="fw-bold">{{ META_DATA.author }}</span>
            </p>
          </BCardBody>
        </BCard>
      </BCol>
      <BCol>
        <div class="h-100 position-relative card-side-img rounded-0 overflow-hidden" style="background-image: url(/images/auth.jpg)">
          <div class="p-4 card-img-overlay auth-overlay d-flex align-items-end justify-content-center" />
        </div>
      </BCol>
    </BRow>
  </div>
</template>

<script setup lang="ts">
import { BCard, BCardBody, BCol, BForm, BRow } from 'bootstrap-vue-next'
import AuthLogo from '~/components/AuthLogo.vue'
import Icon from '~/components/wrappers/Icon.vue'
import { currentYear, META_DATA } from '~/config/constants'

</script>
