<template>
  <footer class="footer">
    <div class="container-fluid">
      <div class="row">
        <div class="col-md-6 text-center text-md-start">
          {{ currentYear }}
          © {{ META_DATA.name }} - By <span class="fw-bold text-decoration-underline text-uppercase text-reset fs-12">{{ META_DATA.author }}</span>
        </div>
        <div class="col-md-6">
          <div class="d-none d-md-flex justify-content-end gap-3">
            <RouterLink to="" class="link-reset">About</RouterLink>
            <RouterLink to="" class="link-reset">Support</RouterLink>
            <RouterLink to="" class="link-reset">Contact Us</RouterLink>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { currentYear, META_DATA } from '~/config/constants'
</script>
