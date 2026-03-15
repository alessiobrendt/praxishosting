<template>
  <PageBreadcrumb title="eCommerce" subtitle="Dashboard" />

  <BRow>
    <BCol xxl="5">
      <BRow class="h-100">
        <BCol lg="3" md="6" xxl="6">
          <UserCard />
        </BCol>
        <BCol v-for="(stat, idx) in statData" :key="idx" lg="3" md="6" xxl="6">
          <EcommerceStatCard :stat="stat" />
        </BCol>
      </BRow>
    </BCol>

    <BCol xxl="7">
      <BRow class="h-100">
        <BCol lg="6">
          <StorePerformanceAnalytics />
        </BCol>
        <BCol lg="6">
          <WeeklyPerformanceInsights />
        </BCol>
      </BRow>
    </BCol>
  </BRow>

  <BRow>
    <BCol xxl="6">
      <SalesReport />
    </BCol>

    <BCol xxl="6">
      <TopSellingProducts />
    </BCol>
  </BRow>

  <BRow>
    <BCol xxl="5">
      <RecentOrders />
    </BCol>

    <BCol xxl="7">
      <BRow>
        <BCol lg="6">
          <RevenueByLocations />
        </BCol>

        <BCol lg="6">
          <RecentActivity />
        </BCol>
      </BRow>
    </BCol>
  </BRow>
</template>

<script setup lang="ts">
import { BCol } from 'bootstrap-vue-next'
import PageBreadcrumb from '~/components/PageBreadcrumb.vue'
import { statData } from './components/data'
import EcommerceStatCard from './components/EcommerceStatCard.vue'
import RecentActivity from './components/RecentActivity.vue'
import RecentOrders from './components/RecentOrders.vue'
import RevenueByLocations from './components/RevenueByLocations.vue'
import SalesReport from './components/SalesReport.vue'
import StorePerformanceAnalytics from './components/StorePerformanceAnalytics.vue'
import TopSellingProducts from './components/TopSellingProducts.vue'
import UserCard from './components/UserCard.vue'
import WeeklyPerformanceInsights from './components/WeeklyPerformanceInsights.vue'
</script>
