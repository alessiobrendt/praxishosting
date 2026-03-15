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
                    <h4 class="fw-bold mt-4">Forgot Password ?</h4>
                    <p class="text-muted w-lg-75 mx-auto">Enter your email address and we'll send you a link to reset your password.</p>
                  </div>

                  <form>
                    <div class="mb-3">
                      <label for="userEmail" class="form-label">
                        Email address
                        <span class="text-danger">*</span>
                      </label>
                      <div class="app-search">
                        <BFormInput type="email" id="userEmail" placeholder="you@example.com" required />
                        <Icon icon="mail" class="app-search-icon text-muted" />
                      </div>
                    </div>

                    <div class="mb-3">
                      <BFormCheckbox name="termAndPolicy"> Agree the Terms & Policy </BFormCheckbox>
                    </div>

                    <div class="d-grid">
                      <BButton type="submit" variant="primary" class="fw-semibold py-2"> Send Request </BButton>
                    </div>
                  </form>

                  <p class="text-muted text-center mt-4 mb-0">
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
import { BCardBody, BCol, BContainer, BRow } from 'bootstrap-vue-next'
import AuthLogo from '~/components/AuthLogo.vue'
import Icon from '~/components/wrappers/Icon.vue'
import { currentYear, META_DATA } from '~/config/constants'

</script>
