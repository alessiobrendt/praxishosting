<template>
  <div class="position-absolute top-0 end-0">
    <img src="/images/auth-card-bg.svg" class="auth-card-bg-img" alt="auth-card-bg" />
  </div>

  <div class="position-absolute start-0 bottom-0" style="transform: rotate(180deg)">
    <img src="/images/auth-card-bg.svg" class="auth-card-bg-img" alt="auth-card-bg" />
  </div>

  <div class="auth-box d-flex align-items-center">
    <BContainer fluid="xxl">
      <BRow class="align-items-center justify-content-center">
        <BCol xl="10">
          <BCard no-body>
            <BRow class="justify-content-between g-0">
              <BCol lg="6">
                <BCardBody class="position-relative">
                  <div class="auth-brand text-center mb-4 position-relative">
                    <AuthLogo />
                    <h4 class="fw-bold mt-4">Request sent Successfully!</h4>
                  </div>

                  <div class="text-center mb-4">
                    <h5 class="text-muted fs-base mb-3">We've emailed you a 6-digit verification code we sent to</h5>
                    <div class="fw-bold fs-3">******6789</div>
                  </div>

                  <BForm>
                    <label class="form-label">Enter your 6-digit code <span class="text-danger">*</span></label>
                    <div class="two-factor mb-3">
                      <VOtpInput v-model:value="otp" :num-inputs="6" separator=" " input-type="tel" :is-input-num="true" :should-auto-focus="true" input-classes="form-control text-center" />
                    </div>

                    <div class="d-grid">
                      <BButton type="submit" variant="primary" class="fw-semibold py-2">Confirm </BButton>
                    </div>
                  </BForm>

                  <p class="mt-4 text-muted text-center mb-4">
                    Don’t have a code?
                    <RouterLink to="" class="text-decoration-underline link-offset-2 fw-semibold"> Resend</RouterLink>
                    or
                    <RouterLink to="" class="text-decoration-underline link-offset-2 fw-semibold">Call Us</RouterLink>
                  </p>

                  <p class="text-muted text-center mb-0">
                    Return to
                    <RouterLink to="/auth/card/sign-in" class="text-decoration-underline link-offset-3 fw-semibold"> Sign in </RouterLink>
                  </p>

                  <p class="text-center text-muted mt-4 mb-0">
                    © {{ currentYear }} {{ META_DATA.name }} — by
                    <span class="fw-bold">{{ META_DATA.author }}</span>
                  </p>
                </BCardBody>
              </BCol>

              <BCol lg="6" class="d-none d-lg-block">
                <div class="h-100 position-relative card-side-img rounded-end overflow-hidden" style="background-image: url(/images/auth.jpg)">
                  <div class="p-4 card-img-overlay rounded-end auth-overlay d-flex align-items-end justify-content-center" />
                </div>
              </BCol>
            </BRow>
          </BCard>
        </BCol>
      </BRow>
    </BContainer>
  </div>
</template>

<script setup lang="ts">
import { BButton, BCardBody, BForm } from 'bootstrap-vue-next'
import { ref } from 'vue'
import VOtpInput from 'vue3-otp-input'
import AuthLogo from '~/components/AuthLogo.vue'
import { currentYear, META_DATA } from '~/config/constants'

const otp = ref('')

</script>

<style scoped></style>
