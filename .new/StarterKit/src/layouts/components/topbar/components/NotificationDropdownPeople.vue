<template>
  <div class="topbar-item" id="notification-dropdown-people">
    
      <BDropdown placement="bottom-end" :variant="null" no-caret toggle-class="topbar-link" menu-class="dropdown-menu-lg p-0 my-0" offset="5">
        <template #button-content>
          <span class="topbar-link-icon">
            <Icon icon="bell" class="animate-ring" />
          </span>
          <BBadge class="text-bg-danger badge-circle topbar-badge">5</BBadge>
        </template>

        <div class="px-3 py-2 border-bottom">
          <BRow class="align-items-center">
            <BCol>
              <h6 class="m-0 fs-md fw-semibold">Messages</h6>
            </BCol>
            <BCol class="text-end">
              <a href="#" class="badge badge-soft-success badge-label py-1">07 Notifications</a>
            </BCol>
          </BRow>
        </div>

        <simplebar style="max-height: 300px">
          <BDropdownItem v-for="(notification, idx) in notificationData" :key="idx" class="notification-item py-2 text-wrap">
            <span class="d-flex align-items-center gap-3 text-wrap">
              <span class="flex-shrink-0 position-relative">
                <img v-if="notification.user" :src="notification.user?.image" class="avatar-md rounded-circle" alt="User Avatar" />
                <span v-if="notification.icon" class="avatar-md rounded-circle bg-light d-flex align-items-center justify-content-center">
                  <Icon :icon="notification.icon" class="fs-4" />
                </span>
                <span :class="['position-absolute rounded-pill  notification-badge', notification.badge.className]">
                  <Icon :icon="notification.badge.icon" class="align-middle" />
                  <span class="visually-hidden">upload notification</span>
                </span>
              </span>
              <span class="flex-grow-1 text-muted">
                <span class="fw-medium text-body">{{ notification.user ? notification.user.name : notification.context }}</span>
                {{ notification.action }}
                <span v-if="notification.user" class="fw-medium text-body">{{ notification.context }}</span>
                <br />
                <span class="fs-xs">{{ notification.time }}</span>
              </span>
              <button type="button" class="flex-shrink-0 text-muted btn btn-link p-0 position-absolute end-0 me-2 d-none noti-close-btn">
                <Icon icon="square-rounded-x" class="fs-xxl" />
              </button>
            </span>
          </BDropdownItem>
        </simplebar>

        <RouterLink to="" class="dropdown-item text-center text-reset text-decoration-underline link-offset-2 fw-bold notify-item border-top border-light py-2"> Read All Messages </RouterLink>
      </BDropdown>
    
  </div>
</template>

<script setup lang="ts">
import simplebar from 'simplebar-vue'
import Icon from '~/components/wrappers/Icon.vue'
import user4 from '/images/users/user-4.jpg'
import user5 from '/images/users/user-5.jpg'
import user6 from '/images/users/user-6.jpg'
import user7 from '/images/users/user-7.jpg'
import user8 from '/images/users/user-8.jpg'

type NotificationType = {
  user?: {
    name: string
    image: string
  }
  icon?: string
  badge: { icon: string; className: string }
  action: string
  context: string
  time: string
}

const notificationData: NotificationType[] = [
  {
    user: {
      name: 'Emily Johnson',
      image: user4,
    },
    badge: {
      icon: 'bell',
      className: 'bg-success',
    },
    action: 'commented on a task in',
    context: 'Design Sprint',
    time: '12 minutes ago',
  },
  {
    user: {
      name: 'Michael Lee',
      image: user5,
    },
    badge: {
      icon: 'cloud-upload',
      className: 'bg-info',
    },
    action: 'uploaded files to',
    context: 'Marketing Assets',
    time: '25 minutes ago',
  },
  {
    icon: 'database',
    badge: {
      icon: 'alert-circle',
      className: 'bg-danger',
    },
    action: 'CPU usage exceeded 90% on',
    context: 'Server #3',
    time: 'Just now',
  },
  {
    user: {
      name: 'Sophia Ray',
      image: user6,
    },
    badge: {
      icon: 'alert-triangle',
      className: 'bg-warning',
    },
    action: 'flagged an issue in',
    context: 'Bug Tracker',
    time: '40 minutes ago',
  },
  {
    user: {
      name: 'David Kim',
      image: user7,
    },
    badge: {
      icon: 'calendar-event',
      className: 'bg-primary',
    },
    action: 'scheduled a meeting for',
    context: 'UX Review',
    time: '1 hour ago',
  },
  {
    user: {
      name: 'Isabella White',
      image: user8,
    },
    badge: {
      icon: 'edit',
      className: 'bg-secondary',
    },
    action: 'updated the document in',
    context: 'Product Specs',
    time: '2 hours ago',
  },
  {
    icon: 'rocket',
    badge: {
      icon: 'check',
      className: 'bg-success',
    },
    action: 'deployment completed successfully on',
    context: 'Production Server',
    time: '30 minutes ago',
  },
]
</script>
