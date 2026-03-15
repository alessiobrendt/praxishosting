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
        <BCol xl="6">
          <BCard class="mb-0" no-body>
            <BCardBody>
              <div class="auth-brand text-center mb-0">
                <AuthLogo />
              </div>

              <div class="p-2 text-center">
                <div class="w-md-50 mx-auto">
                  <img src="/images/maintenance.svg" alt="Maintenance" class="img-fluid" />
                </div>

                <h3 class="fw-bold text-uppercase">We’ll Be Back Soon</h3>
                <p class="text-muted">Our site is undergoing routine maintenance to improve your experience. Thank you for your patience.</p>

                <button class="btn btn-primary mt-3 me-1">Call Support</button>
                <button class="btn btn-info mt-3">Send Email</button>
              </div>

              <p class="text-center text-muted mt-5 mb-0">
                © {{ currentYear }} {{ META_DATA.name }} — by <span class="fw-semibold">{{ META_DATA.author }}</span>
              </p>
            </BCardBody>
          </BCard>
        </BCol>
      </BRow>
    </BContainer>
  </div>
</template>

<script setup lang="ts">
import { BCard, BCardBody, BCol, BContainer, BRow } from 'bootstrap-vue-next'
import AuthLogo from '~/components/AuthLogo.vue'
import { currentYear, META_DATA } from '~/config/constants'

</script>
