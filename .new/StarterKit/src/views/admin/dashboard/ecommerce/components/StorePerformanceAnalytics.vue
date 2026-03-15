<template>
  <BCard no-body class="card-h-100">
    <BCardHeader class="justify-content-between">
      <BCardTitle>Store Performance Analytics</BCardTitle>
      <div>
        <RouterLink to="" class="btn btn-sm btn-default" @click="refreshData"> <Icon icon="refresh" class="me-1"></Icon> Refresh </RouterLink>
      </div>
    </BCardHeader>
    <BCardBody>
      <div dir="ltr">
        <div id="total-sales-chart" class="apex-charts">
          <ApexChart :get-options="salesChartOptions" />
        </div>
      </div>
      <div class="text-center mb-1">
        <span class="badge badge-outline-light text-dark p-1 px-2 rounded-pill fs-12"> <Icon icon="star-filled" class="text-danger me-1" /> POOR SALES </span>
      </div>
    </BCardBody>
    <div v-if="isLoading" class="card-overlay" style="display: flex">
      <div class="spinner-border text-primary"></div>
    </div>
  </BCard>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ApexChart from '~/components/wrappers/ApexChart.vue'
import Icon from '~/components/wrappers/Icon.vue'
import { salesChartOptions } from './data'

const isLoading = ref(false)

const refreshData = () => {
  isLoading.value = true
  setTimeout(() => {
    isLoading.value = false
  }, 1500)
}
</script>
