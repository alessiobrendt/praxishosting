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
                  </div>
                  <div class="mb-4">
                    <div class="avatar-xxl mx-auto mt-2">
                      <div class="avatar-title bg-light-subtle border border-light border-dashed rounded-circle">
                        <img src="/images/delete.png" alt="inactive" height="64" />
                      </div>
                    </div>
                  </div>
                  <h4 class="fw-bold text-center mb-3">Account Deactivated</h4>
                  <p class="text-muted text-center mb-4">Your account is currently inactive. Reactivate now to regain access to all features and opportunities.</p>

                  <div class="d-grid">
                    <BButton type="button" variant="primary" class="fw-semibold py-2"> Reactivate Now </BButton>
                  </div>

                  <p class="text-center text-muted mt-4 mb-0">
                    © {{ currentYear }} {{ META_DATA.name }} — by
                    <span class="fw-bold">{{ META_DATA.author }}</span>
                  </p>
                </BCardBody>
              </BCol>

              <BCol lg="6" class="d-none d-lg-block">
                <div class="h-100 position-relative card-side-img rounded-end overflow-hidden" style="background-image: url(/images/auth.jpg)">
                  <div class="p-4 card-img-overlay rounded-end auth-overlay d-flex align-items-end justify-content-center"></div>
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
import { BButton, BCard, BCardBody, BCol, BContainer, BRow } from 'bootstrap-vue-next'
import AuthLogo from '~/components/AuthLogo.vue'
import { currentYear, META_DATA } from '~/config/constants'

</script>
