<template>
  <PageBreadcrumb title="Tabler" subtitle="Icons" />
  <BRow class="justify-content-center">
    <BCol cols="12">
      <BCard no-body>
        <BCardHeader class="d-block">
          <BCardTitle as="h4" class="mb-1">Overview</BCardTitle>
          <p class="mb-0 text-muted">Free and open source icons designed to make your website or app attractive, visually consistent and simply beautiful.</p>
        </BCardHeader>

        <BCardBody>
          <h4 class="mt-0 fs-base mb-1">Usage</h4>

          <div class="d-flex align-items-center gap-2 mt-3">
            <IconifyIcon icon="tabler:phone" class="fs-2" />
            <IconifyIcon icon="tabler:ad-2" class="fs-2" />
            <IconifyIcon icon="tabler:device-desktop" class="fs-2" />
            <IconifyIcon icon="tabler:device-tablet" class="fs-2" />
            <IconifyIcon icon="tabler:device-gamepad" class="fs-2" />
            <IconifyIcon icon="tabler:device-watch" class="fs-2" />
          </div>
        </BCardBody>

        <BCardBody class="border-top border-dashed">
          <h4 class="mt-0 fs-base mb-1">Colors</h4>

          <div class="d-flex align-items-center gap-2 mt-3">
            <IconifyIcon icon="tabler:camera" class="fs-2 text-primary" />
            <IconifyIcon icon="tabler:chart-pie-2" class="fs-2 text-secondary" />
            <IconifyIcon icon="tabler:bell" class="fs-2 text-success" />
            <IconifyIcon icon="tabler:credit-card" class="fs-2 text-info" />
            <IconifyIcon icon="tabler:cloud" class="fs-2 text-warning" />
            <IconifyIcon icon="tabler:mail" class="fs-2 text-danger" />
            <IconifyIcon icon="tabler:lock" class="fs-2 text-dark" />
            <IconifyIcon icon="tabler:user" class="fs-2 text-purple" />
            <IconifyIcon icon="tabler:star" class="fs-2 text-light" />
          </div>
        </BCardBody>

        <BCardBody class="border-top border-dashed">
          <h4 class="mt-0 fs-base mb-1">Sizes</h4>

          <div class="d-flex align-items-center gap-2 mt-3">
            <IconifyIcon icon="tabler:phone" class="fs-1" />
            <IconifyIcon icon="tabler:ad-2" class="fs-2" />
            <IconifyIcon icon="tabler:device-desktop" class="fs-3" />
            <IconifyIcon icon="tabler:device-tablet" class="fs-4" />
            <IconifyIcon icon="tabler:device-gamepad" class="fs-5" />
            <IconifyIcon icon="tabler:device-watch" class="fs-6" />
          </div>

          <div class="d-flex align-items-center gap-2 mt-3">
            <IconifyIcon icon="tabler:device-watch" class="" />
            <IconifyIcon icon="tabler:device-watch" class="fs-sm" />
            <IconifyIcon icon="tabler:device-watch" class="fs-lg" />
            <IconifyIcon icon="tabler:device-watch" class="fs-xl" />
            <IconifyIcon icon="tabler:device-watch" class="fs-xxl" />
            <IconifyIcon icon="tabler:device-watch" class="fs-24" />
            <IconifyIcon icon="tabler:device-watch" class="fs-32" />
            <IconifyIcon icon="tabler:device-watch" class="fs-36" />
            <IconifyIcon icon="tabler:device-watch" class="fs-42" />
            <IconifyIcon icon="tabler:device-watch" class="fs-60" />
          </div>
        </BCardBody>

        <BCardBody class="border-top border-dashed">
          <h4 class="mt-0 mb-3">Icons</h4>

          <div class="d-flex flex-wrap align-items-center text-center gap-2">
            <div v-for="(item, idx) in tablerIconData" :key="idx" class="avatar-xxl">
              <span class="avatar-title flex-column gap-1 border border-dashed rounded-3 overflow-hidden text-truncate text-center p-1">
                <IconifyIcon :icon="`tabler:${item.iconName}`" class="fs-24" />
                <span class="fw-semibold d-block w-100 text-truncate">{{ item.name }}</span>
              </span>
            </div>
          </div>

          <div class="text-center mt-3">
            <a href="https://tabler.io/icons" target="_blank" class="btn btn-danger">View All Icons</a>
          </div>
        </BCardBody>
      </BCard>
    </BCol>
  </BRow>
</template>

<script setup lang="ts">
import { BCard, BCardBody, BCardHeader, BCol, BRow } from 'bootstrap-vue-next'
import PageBreadcrumb from '~/components/PageBreadcrumb.vue'
import { Icon as IconifyIcon } from '@iconify/vue'

export type TablerIconType = {
  iconName: string
  name: string
}

const tablerIconData: TablerIconType[] = [
  { iconName: 'phone', name: 'Phone' },
  { iconName: 'ad-2', name: 'Ad 2' },
  { iconName: 'headphones', name: 'Headphones' },
  { iconName: 'camera', name: 'Camera' },
  { iconName: 'device-watch', name: 'Watch' },
  { iconName: 'microphone', name: 'Microphone' },
  { iconName: 'headset', name: 'Headset' },
  { iconName: 'device-tablet', name: 'Tablet' },
  { iconName: 'device-gamepad', name: 'Gamepad' },
  { iconName: 'printer', name: 'Printer' },
  { iconName: 'device-speaker', name: 'Speaker' },
  { iconName: 'database', name: 'Database' },
  { iconName: 'cloud', name: 'Cloud' },
  { iconName: 'wifi', name: 'Wi-Fi' },
  { iconName: 'bluetooth', name: 'Bluetooth' },
  { iconName: 'usb', name: 'USB' },
  { iconName: 'folder', name: 'Folder' },
  { iconName: 'lock', name: 'Lock' },
  { iconName: 'key', name: 'Key' },
  { iconName: 'shield', name: 'Shield' },
  { iconName: 'paperclip', name: 'Paperclip' },
  { iconName: 'bell', name: 'Bell' },
  { iconName: 'search', name: 'Search' },
  { iconName: 'briefcase', name: 'Briefcase' },
  { iconName: 'shopping-cart', name: 'Cart' },
  { iconName: 'file', name: 'File' },
  { iconName: 'book', name: 'Book' },
  { iconName: 'mail', name: 'Mail' },
  { iconName: 'user', name: 'User' },
  { iconName: 'user-circle', name: 'User Circle' },
  { iconName: 'phone-call', name: 'Phone Call' },
  { iconName: 'music', name: 'Music' },
  { iconName: 'movie', name: 'Movie' },
  { iconName: 'file-upload', name: 'Upload' },
  { iconName: 'cloud-upload', name: 'Cloud Upload' },
  { iconName: 'share', name: 'Share' },
  { iconName: 'arrow-right', name: 'Arrow Right' },
  { iconName: 'arrow-left', name: 'Arrow Left' },
  { iconName: 'arrow-up', name: 'Arrow Up' },
  { iconName: 'arrow-down', name: 'Arrow Down' },
  { iconName: 'search', name: 'Search' },
  { iconName: 'refresh', name: 'Refresh' },
]
</script>
