<template>
  <BCard no-body class="card-h-100">
    <BCardHeader class="justify-content-between">
      <BCardTitle>Revenue By Locations</BCardTitle>
      <BDropdown class="ms-auto" toggle-class="btn btn-sm btn-default btn-icon" no-caret placement="bottom-end">
        <template #button-content>
          <Icon icon="dots-vertical" class="fs-lg" />
        </template>
        <BDropdownItem href=""> <Icon icon="map" class="me-2" /> View Full Map </BDropdownItem>
        <BDropdownItem href=""> <Icon icon="download" class="me-2" /> Export Revenue Data </BDropdownItem>
        <BDropdownItem href=""> <Icon icon="filter-2" class="me-2" /> Filter By Region </BDropdownItem>
        <hr class="dropdown-divider" />
        <BDropdownItem class="text-danger" href=""> <Icon icon="trash" class="me-2" /> Remove Widget </BDropdownItem>
      </BDropdown>
    </BCardHeader>

    <BCardBody class="pt-1">
      <div style="height: 206px">
        <JsVectorMap id="revenue-by-location" :options="revenueLocationMapOptions()" />
      </div>

      <div class="mt-3">
        <div class="p-2 mb-3 border-dashed border rounded">
          <div class="d-flex align-items-center">
            <div class="avatar-lg flex-shrink-0 me-2">
              <span class="avatar-title bg-warning-subtle rounded-circle fs-1">
                <Icon icon="medal" class="text-warning" />
              </span>
            </div>
            <div class="flex-gow-1">
              <h5 class="mb-0 fw-semibold">Congratulations !...</h5>
              <p class="mb-0 text-muted">You've just hit a new record..</p>
            </div>
            <div class="ms-auto">
              <h4 class="fs-16 mt-1 mb-0">25.9k</h4>
              <span class="text-muted fw-semibold fs-12">ORDERS</span>
            </div>
          </div>
        </div>

        <div v-for="(country, idx) in countryData" :class="['d-flex align-items-center  gap-2', idx === countryData.length - 1 ? '' : 'mb-2']" :key="idx">
          <Icon icon="circle" :class="['fs-md', country.className]" />
          <div>{{ country.name }}</div>
          <p class="mb-0 ms-auto">
            <span class="fw-semibold">{{ country.prefix }}{{ country.revenue }}{{ country.suffix }}</span> <span class="text-muted">Revenue</span>
          </p>
        </div>
      </div>
    </BCardBody>
  </BCard>
</template>

<script setup lang="ts">
import JsVectorMap from '~/components/JsVectorMap.vue'
import Icon from '~/components/wrappers/Icon.vue'
import { countryData, revenueLocationMapOptions } from './data'
</script>
