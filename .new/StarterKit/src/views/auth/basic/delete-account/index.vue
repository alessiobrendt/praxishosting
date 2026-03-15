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

            <div class="mb-4">
              <div class="avatar-xxl mx-auto mt-2">
                <div class="avatar-title bg-light-subtle border border-light border-dashed rounded-circle">
                  <img src="/images/delete.png" alt="dark logo" height="64" />
                </div>
              </div>
            </div>

            <h4 class="fw-bold text-center mb-3">Account Deactivated</h4>
            <p class="text-muted text-center mb-4">Your account is currently inactive. Reactivate now to regain access to all features and opportunities.</p>

            <div class="d-grid">
              <BButton variant="primary" type="submit" class="fw-semibold py-2">Reactivate Now</BButton>
            </div>
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
import { BButton, BCard, BCol, BContainer, BRow } from 'bootstrap-vue-next'
import AuthLogo from '~/components/AuthLogo.vue'
import { currentYear, META_DATA } from '~/config/constants'

</script>
