<template>
  <div class="page-title-head d-flex align-items-center">
    <div class="flex-grow-1">
      <h4 class="fs-sm page-main-title fw-bold m-0">{{ title }}</h4>
    </div>

    <div class="text-end">
      <ol class="breadcrumb m-0 py-0">
        <li class="breadcrumb-item d-flex align-items-center">
          <RouterLink to="/">{{ META_DATA.name }}</RouterLink>
        </li>
        <li v-if="subtitle" class="breadcrumb-item d-flex align-items-center">
          <RouterLink :to="subtitleUrl ?? '#'">{{ subtitle }}</RouterLink>
        </li>
        <li class="breadcrumb-item active">{{ title }}</li>
      </ol>
    </div>
  </div>
</template>

<script setup lang="ts">
import { META_DATA } from '~/config/constants'
type PropsType = {
  title: string
  subtitle?: string
  subtitleUrl?: string
}

const props = defineProps<PropsType>()
</script>
