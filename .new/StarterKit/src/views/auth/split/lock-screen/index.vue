<template>
  <div class="auth-box p-0 w-100">
    <BRow class="w-100 g-0">
      <BCol md="auto">
        <BCard no-body class="auth-box-form border-0 mb-0">
          <div class="position-absolute top-0 end-0" style="width: 180px">
            <img src="/images/auth-card-bg.svg" class="auth-card-bg-img" alt="auth-card-bg" />
          </div>
          <BCardBody class="min-vh-100 position-relative d-flex flex-column justify-content-center">
            <div class="auth-brand mb-0 text-center">
              <AuthLogo />
            </div>

            <div class="mt-auto">
              <p class="text-muted text-center auth-sub-text mx-auto">Let’s get you signed in. Enter your password to continue.</p>

              <div class="text-center mb-4">
                <img src="/images/users/user-1.jpg" class="rounded-circle img-thumbnail avatar-xxl mb-2" alt="thumbnail" />
                <h5 class="fs-md">Damian D.</h5>
              </div>

              <form>
                <div class="mb-3">
                  <label for="userPassword" class="form-label">
                    Password
                    <span class="text-danger">*</span>
                  </label>
                  <div class="app-search">
                    <BFormInput type="password" id="userPassword" placeholder="Enter password" required />
                    <Icon icon="lock-password" class="app-search-icon text-muted"></Icon>
                  </div>
                </div>

                <div class="d-flex justify-content-between align-items-center mb-3">
                  <div class="form-check">
                    <input class="form-check-input form-check-input-light fs-14" type="checkbox" checked id="rememberMe" />
                    <label class="form-check-label" for="rememberMe">Keep me signed in</label>
                  </div>

                  <a href="/auth/split/reset-pass" class="text-decoration-underline link-offset-3 text-muted">Forgot Password?</a>
                </div>

                <div class="d-grid">
                  <BButton variant="primary" type="submit" class="fw-semibold py-2">Sign In</BButton>
                </div>
              </form>

              <p class="mt-4 text-muted text-center mb-4">
                Not you? Return to
                <RouterLink to="/auth/split/sign-in" class="text-decoration-underline link-offset-3 fw-semibold"> Sign in </RouterLink>
              </p>
            </div>

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
import { BButton, BCard, BCardBody, BCol, BFormInput, BRow } from 'bootstrap-vue-next'
import AuthLogo from '~/components/AuthLogo.vue'
import Icon from '~/components/wrappers/Icon.vue'
import { currentYear, META_DATA } from '~/config/constants'

</script>

<style lang="scss" scoped></style>
