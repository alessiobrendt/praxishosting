<template>
  <BCard no-body class="card-h-100">
    <BCardHeader class="justify-content-between">
      <h4 class="card-title mb-0">Weekly Performance Insights</h4>
      <BDropdown class="ms-auto" toggle-class="btn btn-sm btn-default btn-icon" size="sm" no-caret>
        <template #button-content>
          <Icon icon="dots-vertical" class="fs-lg" />
        </template>
        <BDropdownItem>
          <Icon icon="refresh" class="me-2" />
          Refresh Data
        </BDropdownItem>
        <BDropdownItem>
          <Icon icon="download" class="me-2" />
          Download Report
        </BDropdownItem>
        <BDropdownItem>
          <Icon icon="share" class="me-2" />
          Share Insights
        </BDropdownItem>
        <BDropdownDivider />
        <BDropdownItem class="text-danger">
          <Icon icon="archive" class="me-2" />
          Archive Widget
        </BDropdownItem>
      </BDropdown>
    </BCardHeader>

    <BCardBody>
      <div dir="ltr">
        <div id="weekly-performance-chart" class="apex-charts">
          <ApexChart :get-options="getWeeklyPerformanceChartOptions" />
        </div>
      </div>
    </BCardBody>
  </BCard>
</template>

<script setup lang="ts">
import ApexChart from '~/components/wrappers/ApexChart.vue'
import Icon from '~/components/wrappers/Icon.vue'
import { getWeeklyPerformanceChartOptions } from './data'
</script>
