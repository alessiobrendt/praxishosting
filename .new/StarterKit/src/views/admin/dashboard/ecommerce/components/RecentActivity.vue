<template>
  <BCard no-body class="card-h-100">
    <BCardHeader class="justify-content-between">
      <BCardTitle>Recent Activity</BCardTitle>
      <BDropdown class="ms-auto" toggle-class="btn btn-sm btn-default btn-icon" no-caret>
        <template #button-content>
          <Icon icon="dots-vertical" class="fs-lg" />
        </template>
        <BDropdownItem href=""> <Icon icon="activity" class="me-2" /> View Activity Log </BDropdownItem>
        <BDropdownItem href=""> <Icon icon="filter-2" class="me-2" /> Filter Activities </BDropdownItem>
        <BDropdownItem href=""> <Icon icon="download" class="me-2" /> Export Logs </BDropdownItem>
        <hr class="dropdown-divider" />
        <BDropdownItem class="text-danger" href=""> <Icon icon="trash" class="me-2" /> Clear Activity </BDropdownItem>
      </BDropdown>
    </BCardHeader>

    <simplebar class="card-body" style="max-height: 426px">
      <div class="timeline timeline-users">
        <div v-for="(activity, idx) in activityData" class="timeline-item d-flex align-items-stretch" :key="idx">
          <div :class="['timeline-dot', activity.iconClassName]">
            <Icon :icon="activity.icon" class="fs-md" />
          </div>
          <div :class="['timeline-content ps-3', activityData.length - 1 !== idx ? 'pb-4' : '']">
            <h5 class="mb-1">{{ activity.title }}</h5>
            <p class="mb-1 text-muted">{{ activity.description }}</p>
            <span class="text-primary fw-semibold">By {{ activity.author }}</span>
          </div>
        </div>
      </div>
    </simplebar>
  </BCard>
</template>

<script setup lang="ts">
import simplebar from 'simplebar-vue'
import Icon from '~/components/wrappers/Icon.vue'
import { activityData } from './data'
</script>
