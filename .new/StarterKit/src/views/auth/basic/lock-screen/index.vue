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
            <div class="auth-brand text-center mb-3 position-relative">
              <AuthLogo />
            </div>

            <div class="text-center mb-4">
              <img src="/images/users/user-1.jpg" class="rounded-circle img-thumbnail avatar-xxl mb-2" alt="thumbnail" />
              <h5 class="fs-md">{{ META_DATA.username }}</h5>
            </div>

            <BForm>
              <div class="mb-3">
                <label for="userPassword" class="form-label"> Password <span class="text-danger">*</span> </label>
                <div class="input-group">
                  <BFormInput type="password" id="userPassword" placeholder="••••••••" required />
                </div>
              </div>

              <div class="d-grid">
                <BButton type="submit" variant="primary" class="fw-semibold py-2 w-100"> Unlock </BButton>
              </div>
            </BForm>

            <p class="text-muted text-center mt-4 mb-0">
              Not you? Return to
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
import { BButton, BCard, BCol, BContainer, BForm, BFormInput, BRow } from 'bootstrap-vue-next'
import AuthLogo from '~/components/AuthLogo.vue'
import { currentYear, META_DATA } from '~/config/constants'

</script>
