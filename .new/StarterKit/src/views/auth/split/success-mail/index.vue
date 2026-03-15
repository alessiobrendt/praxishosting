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
              <BForm class="mt-4">
                <div class="mb-4">
                  <div class="avatar-xxl mx-auto mt-2">
                    <div class="avatar-title bg-light-subtle border border-light border-dashed rounded-circle">
                      <img src="/images/checkmark.png" alt="checkmark" height="64" />
                    </div>
                  </div>
                </div>

                <h4 class="fw-bold text-center mb-4">Well Done! Email verified Successfully</h4>

                <div class="d-grid">
                  <BButton variant="primary" type="submit" class="fw-semibold py-2"> Back to Dashboard </BButton>
                </div>
              </BForm>
            </div>

            <p class="text-muted text-center mt-4 mb-0">
              Return to
              <RouterLink to="/auth/split/sign-in" class="text-decoration-underline link-offset-3 fw-semibold"> Sign in </RouterLink>
            </p>

            <p class="text-center text-muted mt-auto mb-0">
              © {{ currentYear }} {{ META_DATA.name }} — by
              <span class="fw-bold">{{ META_DATA.author }}</span>
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
import { currentYear, META_DATA } from '~/config/constants'

</script>

<style lang="scss" scoped></style>
