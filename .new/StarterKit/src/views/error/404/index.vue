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
          <BCard class="p-4" no-body>
            <div class="auth-brand text-center mb-2">
              <AuthLogo />
            </div>

            <div class="p-4 text-center">
              <div class="error-text-alt fs-72 text-warning">404</div>
              <h3 class="fw-bold text-uppercase">Nothing Here</h3>
              <p class="text-muted fs-5">We couldn’t find the page you were looking for. It might have been moved or deleted.</p>

              <div class="mt-4 d-flex justify-content-center gap-1">
                <RouterLink to="/" class="btn btn-primary">Back to Home</RouterLink>
                <RouterLink to="" class="btn btn-outline-info">Search</RouterLink>
              </div>
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
import { BCard, BCol, BContainer, BRow } from 'bootstrap-vue-next'
import AuthLogo from '~/components/AuthLogo.vue'
import { META_DATA, currentYear } from '~/config/constants'

</script>
