<template>
  <div id="user-dropdown-detailed" class="topbar-item nav-user">
    
      <BDropdown toggle-class="topbar-link" no-caret placement="bottom-end" offset="5">
        <template #button-content>
          <img src="/images/users/user-1.jpg" width="32" class="rounded-circle me-lg-2 d-flex" alt="user-image" />
          <div class="d-lg-flex align-items-center gap-1 d-none">
            <span>
              <h5 class="my-0 lh-1 pro-username">{{ META_DATA.username }}</h5>
              <span class="fs-xs lh-1">Admin Head</span>
            </span>
            <Icon icon="chevron-down" class="align-middle" />
          </div>
        </template>
        <BDropdownHeader class="noti-title">
          <h6 class="text-overflow m-0">Welcome back 👋!</h6>
        </BDropdownHeader>

        <template v-for="(item, idx) in userProfileMenuData" :key="idx">
          <RouterLink :to="item.href" :class="['dropdown-item', item.className]">
            <Icon :icon="item.icon" class="me-1 fs-lg align-middle" />
            <span class="align-middle">{{ item.label }}</span>
          </RouterLink>

          <BDropdownDivider v-if="item.isDivider" />
        </template>
      </BDropdown>
    
  </div>
</template>

<script setup lang="ts">
import { BDropdown } from 'bootstrap-vue-next'
import Icon from '~/components/wrappers/Icon.vue'
import { META_DATA } from '~/config/constants'

type UserProfileMenuType = {
  icon: string
  label: string
  href: string
  className?: string
  isDivider?: boolean
}

const userProfileMenuData: UserProfileMenuType[] = [
  {
    icon: 'user-circle',
    label: 'Profile',
    href: '',
  },
  {
    icon: 'bell-ringing',
    label: 'Notifications',
    href: '',
  },
  {
    icon: 'settings-2',
    label: 'Account Settings',
    href: '',
  },
  {
    icon: 'headset',
    label: 'Support Center',
    href: '',
    isDivider: true,
  },
  {
    icon: 'lock',
    label: 'Lock Screen',
    href: '/auth/lock-screen',
  },
  {
    icon: 'logout',
    label: 'Log Out',
    href: '',
    className: 'fw-semibold',
  },
]
</script>
