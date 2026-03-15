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
              <p class="text-muted text-center auth-sub-text mx-auto">We've emailed you a 6-digit verification code. Please enter it below to confirm your Email Address.</p>

              <BForm class="mt-4">
                <div class="mb-3">
                  <label class="form-label d-flex"> Enter your 6-digit code <span class="text-danger ms-1">*</span> </label>
                  <VOtpInput v-model:value="otp" :num-inputs="6" input-classes="form-control text-center" input-type="tel" :is-input-num="true" :should-auto-focus="true" separator=" " />
                </div>

                <div class="mb-3" data-password="bar">
                  <label for="userPassword" class="form-label">
                    New Password
                    <span class="text-danger">*</span>
                  </label>
                  <div class="app-search">
                    <BFormInput type="password" v-model="password" placeholder="Enter Password" required />
                    <Icon icon="lock-password" class="app-search-icon text-muted" />
                  </div>
                  <PasswordStrengthBar :password="password" />
                </div>

                <div class="mb-3 d-flex">
                  <BFormCheckbox name="termAndPolicy"> Agree the Terms & Policy </BFormCheckbox>
                </div>

                <div class="d-grid">
                  <BButton variant="primary" type="submit" class="fw-semibold py-2">Update Password </BButton>
                </div>
              </BForm>

              <p class="text-muted text-center mt-4 mb-0">
                Don’t have a code?
                <a href="" class="text-decoration-underline link-offset-2 fw-semibold">Resend</a> or
                <a href="" class="text-decoration-underline link-offset-2 fw-semibold">Call Us</a>
              </p>
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
import { BCard, BCol, BForm, BFormInput, BRow } from 'bootstrap-vue-next'
import { ref } from 'vue'
import VOtpInput from 'vue3-otp-input'
import AuthLogo from '~/components/AuthLogo.vue'
import PasswordStrengthBar from '~/components/PasswordStrengthBar.vue'
import Icon from '~/components/wrappers/Icon.vue'
import { currentYear, META_DATA } from '~/config/constants'

const password = ref('')

const otp = ref('')

</script>
