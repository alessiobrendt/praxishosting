<template>
  <BCard no-body class="card-h-100">
    <BCardBody>
      <div class="d-flex justify-content-between">
        <div>
          <h5 class="text-muted fs-base text-uppercase" title="Number of Orders">{{ stat.title }}</h5>
          <h3 class="my-3 py-1 fw-semibold"><CountUp :end-val="stat.value" :options="{ decimalPlaces: Number.isInteger(stat.value) ? 0 : 2, prefix: stat.prefix || '', suffix: stat.suffix || '' }" /></h3>
          <p class="mb-0 text-muted">
            <span :class="['me-2', stat.change > 0 ? 'text-success' : 'text-danger']">
              <Icon v-if="stat.change > 0" icon="arrow-up" />
              <Icon v-else icon="arrow-down" />
              {{ Math.abs(stat.change) }}%</span
            >
            <span class="text-nowrap">Since last month</span>
          </p>
        </div>
        <div class="avatar-md flex-shrink-0">
          <span class="avatar-title bg-primary-subtle rounded-circle fs-22">
            <Icon :icon="stat.icon" class="text-primary" />
          </span>
        </div>
      </div>
    </BCardBody>
  </BCard>
</template>

<script setup lang="ts">
import CountUp from 'vue-countup-v3'
import Icon from '~/components/wrappers/Icon.vue'
import type { StatType } from './data'

defineProps<{ stat: StatType }>()
</script>
