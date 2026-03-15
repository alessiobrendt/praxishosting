<template>
  <div class="position-absolute top-0 end-0">
    <img src="/images/auth-card-bg.svg" class="auth-card-bg-img" alt="auth-card-bg" />
  </div>

  <div class="position-absolute start-0 bottom-0" style="transform: rotate(180deg)">
    <img src="/images/auth-card-bg.svg" class="auth-card-bg-img" alt="auth-card-bg" />
  </div>

  <div class="auth-box overflow-hidden align-items-center d-flex">
    <BContainer>
      <BRow class="justify-content-center">
        <BCol xxl="5" md="6" sm="8">
          <BCard no-body class="p-4">
            <div class="auth-brand text-center mb-4">
              <AuthLogo />
              <p class="text-muted w-lg-75 mt-3 mx-auto">Enter your email address and we'll send you a link to reset your password.</p>
            </div>

            <BForm>
              <div class="mb-3">
                <label for="userEmail" class="form-label"> Email address <span class="text-danger">*</span> </label>
                <div class="input-group">
                  <BFormInput type="email" id="userEmail" placeholder="you@example.com" required />
                </div>
              </div>

              <div class="mb-3">
                <BFormCheckbox name="agree"> Agree the Terms & Policy </BFormCheckbox>
              </div>

              <div class="d-grid">
                <BButton variant="primary" type="submit" class="fw-semibold py-2"> Send Request </BButton>
              </div>
            </BForm>
            <p class="text-muted text-center mt-4 mb-0">
              Return to
              <RouterLink to="/auth/sign-in" class="text-decoration-underline link-offset-3 fw-semibold"> Sign in </RouterLink>
            </p>
          </BCard>

          <p class="text-center text-muted mt-4 mb-0">
            © {{ currentYear }} {{ META_DATA.name }} — by <span class="fw-semibold">{{ META_DATA.author }}</span>
          </p>
        </BCol>
      </BRow>
    </BContainer>
  </div>
</template>

<script setup lang="ts">
import { BCard, BCol, BContainer, BForm, BRow } from 'bootstrap-vue-next'
import AuthLogo from '~/components/AuthLogo.vue'
import { currentYear, META_DATA } from '~/config/constants'

</script>
