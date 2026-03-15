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
          <BCard no-body class="rounded-4">
            <BRow class="justify-content-between g-0">
              <BCol lg="6">
                <BCardBody class="position-relative">
                  <div class="auth-brand text-center mb-4 position-relative">
                    <AuthLogo />
                    <h4 class="fw-bold mt-4">Welcome to Admin</h4>
                    <p class="text-muted w-lg-75 mx-auto">This screen is locked. Enter your PIN to continue.</p>
                  </div>
                  <div class="text-center mb-4">
                    <img src="/images/users/user-1.jpg" class="rounded-circle img-thumbnail avatar-xxl mb-2" alt="thumbnail" />
                    <h5 class="fs-md">{{ META_DATA.username }}</h5>
                  </div>
                  <BForm>
                    <label class="form-label">Enter your 6-digit code <span class="text-danger">*</span></label>
                    <div class="mb-3 two-factor">
                      <VOtpInput v-model:value="otp" :num-inputs="6" input-classes="form-control text-center" input-type="tel" :is-input-num="true" :should-auto-focus="true" separator=" " />
                    </div>
                    <div class="d-grid">
                      <BButton type="submit" variant="primary" class="fw-semibold py-2 w-100"> Confirm </BButton>
                    </div>
                  </BForm>
                  <p class="text-muted text-center mt-4 mb-0">
                    Not you? Return to
                    <RouterLink to="/auth/card/sign-in" class="text-decoration-underline link-offset-3 fw-semibold"> Sign in </RouterLink>
                  </p>
                  <p class="text-center text-muted mt-4 mb-0">
                    © {{ currentYear }} {{ META_DATA.name }} — by
                    <span class="fw-bold">{{ META_DATA.author }}</span>
                  </p>
                </BCardBody>
              </BCol>
              <BCol lg="6" class="d-none d-lg-block">
                <div class="h-100 position-relative card-side-img rounded-end rounded-0 overflow-hidden" style="background-image: url(/images/auth.jpg)">
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
import { BButton, BCard, BCardBody, BCol, BContainer, BForm, BRow } from 'bootstrap-vue-next'
import { ref } from 'vue'
import VOtpInput from 'vue3-otp-input'
import AuthLogo from '~/components/AuthLogo.vue'
import { currentYear, META_DATA } from '~/config/constants'

const otp = ref('')

</script>

<style scoped></style>
