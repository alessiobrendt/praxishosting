<template>
  <BCard no-body class="card-h-100">
    <BCardBody class="pb-0">
      <div class="d-flex align-items-center justify-content-between mb-2">
        <div class="overflow-hidden flex-shrink-0">
          <h3 class="fw-normal text-reset fs-20 lh-base">
            <span class="text-muted fs-base text-uppercase h5">Good Day,</span> <br />
            <b>{{ META_DATA.username }}!</b>
          </h3>
        </div>
        <div class="flex-grow-1 text-end">
          <img class="d-none d-xxl-inline-block" :src="emailCampaign" width="110" alt="Generic placeholder image" />
        </div>
      </div>
    </BCardBody>
    <BCardBody class="d-flex align-items-center p-2 bg-light bg-opacity-50">
      <p class="d-flex align-items-center justify-content-between w-100 mb-0">
        <span class="me-2"
          ><Icon icon="calendar" class="fs-15 align-middle" />
          <span class="align-middle ms-1 fw-semibold">
            {{ new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) }}
          </span></span
        >
        <span class="text-nowrap"
          ><Icon icon="clock" class="fs-15 align-middle" /><span class="align-middle ms-1 fw-semibold" id="clock-widget"> {{ currentTime }}</span></span
        >
      </p>
    </BCardBody>
  </BCard>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import Icon from '~/components/wrappers/Icon.vue'
import { META_DATA } from '~/config/constants'

const emailCampaign = '/images/svg/email-campaign.svg'

const currentTime = ref('')

let timer: ReturnType<typeof setInterval> | null = null

const updateTime = () => {
  const now = new Date()
  currentTime.value = now.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  })
}

onMounted(() => {
  updateTime()
  timer = setInterval(updateTime, 1000)
})

onBeforeUnmount(() => {
  if (timer) clearInterval(timer)
})
</script>
