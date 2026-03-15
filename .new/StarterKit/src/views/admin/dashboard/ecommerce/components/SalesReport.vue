<template>
  <BCard class="card-h-100" no-body>
    <BCardHeader class="border-dashed card-tabs">
      <div class="flex-grow-1">
        <BCardTitle>Sales Report <span class="text-muted fs-base fw-normal">(25822 Orders)</span></BCardTitle>
      </div>
      <BTabs justified nav-class="nav-bordered card-header-tabs" content-class="p-0">
        <BTab active>
          <template #title>
            <span class="d-md-none d-block">1D</span>
            <span class="d-none d-md-block">Today</span>
          </template>
        </BTab>
        <BTab>
          <template #title>
            <span class="d-md-none d-block">1M</span>
            <span class="d-none d-md-block">Monthly</span>
          </template>
        </BTab>
        <BTab>
          <template #title>
            <span class="d-md-none d-block">1Y</span>
            <span class="d-none d-md-block">Annual</span>
          </template>
        </BTab>
      </BTabs>
    </BCardHeader>
    <BCardBody class="p-0">
      <div class="bg-light bg-opacity-25 border-bottom border-dashed">
        <BRow class="text-center">
          <BCol v-for="(report, idx) in saleReportData" :key="idx" sm="4">
            <p class="text-muted mt-3 mb-1">{{ report.title }}</p>
            <h4 class="mb-3 d-flex align-items-center justify-content-center">
              <Icon :icon="report.icon" class="text-success me-1" />
              <CountUp :end-val="report.value" :options="{ prefix: report.prefix || '', suffix: report.suffix || '', decimalPlaces: Number.isInteger(report.value) ? 0 : 2 }" />
            </h4>
          </BCol>
        </BRow>
      </div>

      <div class="p-3 pt-1">
        <div class="dash-item-overlay d-none d-md-block" dir="ltr">
          <h5>Today's Earning: $8,975.30</h5>
          <p class="text-muted mb-0 mt-2">Property PS007 is not receiving hits. Either your site is not receiving any sessions.</p>
        </div>
        <div dir="ltr">
          <div id="sales-report-chart" class="apex-charts">
            <ApexChart :get-options="getSalesReportChartOptions" :series="getSalesReportChartOptions().series" />
          </div>
        </div>
      </div>
    </BCardBody>
  </BCard>
</template>

<script setup lang="ts">
import { BCard } from 'bootstrap-vue-next'
import CountUp from 'vue-countup-v3'
import ApexChart from '~/components/wrappers/ApexChart.vue'
import Icon from '~/components/wrappers/Icon.vue'
import { getSalesReportChartOptions, saleReportData } from './data'
</script>
