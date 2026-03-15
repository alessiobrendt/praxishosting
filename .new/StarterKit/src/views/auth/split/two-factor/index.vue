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

            <div class="mt-auto text-center">
              <p class="text-muted text-center auth-sub-text mx-auto">We've emailed you a 6-digit verification code we sent to</p>
              <div class="text-center mb-4">
                <div class="fw-bold fs-3">******6789</div>
              </div>

              <form class="mt-4">
                <div class="mb-3">
                  <label class="form-label d-flex">Enter your 6-digit code <span class="text-danger">*</span></label>
                  <div class="mb-3 two-factor">
                    <VOtpInput v-model:value="otp" :num-inputs="6" input-classes="form-control text-center" input-type="tel" :is-input-num="true" :should-auto-focus="true" separator=" " />
                  </div>
                </div>

                <div class="d-grid">
                  <BButton variant="primary" type="submit" class="fw-semibold py-2">Confirm </BButton>
                </div>
              </form>

              <p class="text-muted text-center mt-4 mb-0">
                Don’t have a code?
                <a href="" class="text-decoration-underline link-offset-2 fw-semibold">Resend</a> or
                <a href="" class="text-decoration-underline link-offset-2 fw-semibold">Call Us</a>
              </p>
            </div>

            <p class="text-muted text-center mt-4 mb-0">
              Return to
              <RouterLink to="/auth/split/sign-in" class="text-decoration-underline link-offset-3 fw-semibold">Sign in </RouterLink>
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
import { BCard, BCardBody, BCol, BRow } from 'bootstrap-vue-next'
import { ref } from 'vue'
import VOtpInput from 'vue3-otp-input'
import AuthLogo from '~/components/AuthLogo.vue'
import { currentYear, META_DATA } from '~/config/constants'

const otp = ref('')

</script>

<style scoped></style>
