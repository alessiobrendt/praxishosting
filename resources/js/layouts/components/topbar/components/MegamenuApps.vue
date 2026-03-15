<template>
  <div id="megamenu-apps" class="topbar-item d-none d-md-flex">
    <BDropdown
      v-model="isOpen"
      teleport-disabled
      :variant="null"
      toggle-class="topbar-link btn fw-medium btn-link drop-arrow-none"
      menu-class="dropdown-menu-xxl p-0"
    >
      <template #button-content>
        Apps
        <Icon icon="chevron-down" class="ms-1" />
      </template>
      <template v-if="isOpen">
      <div class="h-100" style="max-height: 380px">
        <div class="row g-0">
          <div class="col-sm-8">
            <div class="row g-0">
              <div class="col-sm-6" v-for="(column, idx) in chunkedApps" :key="idx">
                <div class="p-2">
                  <a v-for="(item, index) in column" :key="index" :href="item.href" class="dropdown-item" :class="[index === 0 ? 'mt-0' : '', index == column.length - 1 ? 'mt-2' : 'my-2']">
                    <span class="d-flex align-items-center">
                      <span class="avatar-md me-2">
                        <span class="avatar-title border border-light bg-light bg-opacity-50 rounded" :class="item.iconClassName">
                          <Icon :icon="item.icon" class="fs-22" />
                        </span>
                      </span>

                      <span>
                        <h5 class="fs-base mb-0 lh-base">{{ item.title }}</h5>
                        <span class="text-muted fs-12">{{ item.subtitle }}</span>
                      </span>
                    </span>
                  </a>
                </div>
              </div>
            </div>

            <div class="row g-0 border-top border-light border-dashed text-center">
              <div class="col">
                <div class="p-3">
                  <p class="fw-medium text-muted mb-2 fs-11 text-uppercase lh-1">-: &nbsp; Support &nbsp;:-</p>
                  <h5 class="fs-15 mb-0">help@mydomain.com</h5>
                </div>
              </div>
              <div class="col">
                <div class="p-3">
                  <p class="fw-medium text-muted mb-2 fs-11 text-uppercase lh-1">-: &nbsp; Help: &nbsp;:-</p>
                  <h5 class="fs-15 mb-0">+(12) 3456 7890</h5>
                </div>
              </div>
            </div>
          </div>

          <div class="col-sm-4">
            <div class="h-100 position-relative rounded-end rounded-0 overflow-hidden" style="background: url(/images/stock/small-8.jpg); background-size: cover">
              <div class="p-3 card-img-overlay bg-gradient bg-secondary bg-opacity-90 d-flex align-items-center justify-content-center">
                <div class="text-center text-white">
                  <Icon icon="atom" class="fs-36" />
                  <p class="text-white text-opacity-75 mb-3 text-uppercase">Limited Offer</p>
                  <h3 class="fw-semibold text-white mb-2 fs-20">Unlock Exclusive Savings</h3>
                  <h4 class="fw-medium fs-16 mb-1">
                    <del class="text-opacity-75 text-white">$49.00</del>
                    /
                    <span class="fw-bold text-white">$25 USD</span>
                  </h4>
                  <button type="button" class="btn btn-danger btn-sm mt-3">
                    <Icon icon="shopping-cart" class="me-1" />
                    Grab Deal
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </template>
    </BDropdown>
  </div>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue'
import Icon from '@/components/wrappers/Icon.vue'
import { topbarDropdownKey } from '@/composables/useTopbarDropdown'

const topbarDropdown = inject(topbarDropdownKey)
const DROPDOWN_ID = 'megamenu-apps'
const isOpen = computed({
    get: () => topbarDropdown?.openDropdownId.value === DROPDOWN_ID,
    set: (v: boolean) => topbarDropdown?.setOpen(v ? DROPDOWN_ID : null),
})

const chunkArray = <T,>(arr: T[], size: number): T[][] => {
  return Array.from({ length: Math.ceil(arr.length / size) }, (_, i) => arr.slice(i * size, i * size + size))
}

type AppMenuItemType = {
  icon: string
  iconClassName: string
  title: string
  subtitle: string
  href: string
}

const appsMenuData: AppMenuItemType[] = [
  {
    icon: 'basket',
    iconClassName: 'text-primary',
    title: 'eCommerce',
    subtitle: 'Products, orders & etc.',
    href: '#',
  },
  {
    icon: 'message',
    iconClassName: 'text-success',
    title: 'Chat',
    subtitle: 'Team conversations',
    href: '#',
  },
  {
    icon: 'list-check',
    iconClassName: 'text-danger',
    title: 'Task',
    subtitle: 'Plan and track work',
    href: '#',
  },
  {
    icon: 'mailbox',
    iconClassName: 'text-info',
    title: 'Email',
    subtitle: 'Messages and inbox',
    href: '#',
  },
  {
    icon: 'building',
    iconClassName: 'text-secondary',
    title: 'Companies',
    subtitle: 'Business profiles',
    href: '#',
  },
  {
    icon: 'id',
    iconClassName: 'text-dark',
    title: 'Contacts Diary',
    subtitle: 'People and connections',
    href: '#',
  },
  {
    icon: 'calendar',
    iconClassName: 'text-warning',
    title: 'Calendar',
    subtitle: 'Events and reminders',
    href: '#',
  },
  {
    icon: 'lifebuoy',
    iconClassName: 'text-success',
    title: 'Support',
    subtitle: 'Help and assistance',
    href: '#',
  },
]

const chunkedApps = chunkArray(appsMenuData, 4)
</script>
