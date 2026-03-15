<template>
  <PageBreadcrumb title="Preloader" subtitle="Layouts" />

  <div id="preloader" v-if="isReloading">
    <div class="spinner-border text-primary" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  </div>

  <BRow>
    <Col xs="12">
      <Card>
        <CardBody class="text-center">
          <h4 class="m-0">Your custom content here</h4>
        </CardBody>
      </Card>
    </Col>
  </BRow>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import PageBreadcrumb from '~/components/PageBreadcrumb.vue'

const isReloading = ref(true)

setTimeout(() => {
  isReloading.value = false
}, 1000)
</script>
