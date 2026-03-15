<template>
  <div class="sidenav-user" style="background: url(/images/user-bg-pattern.svg)">
    <div class="d-flex justify-content-between align-items-center">
      <div>
        <Link href="#" class="link-reset">
          <img src="/images/users/user-1.jpg" alt="user-image" class="rounded-circle mb-2 avatar-md" />
          <span class="sidenav-user-name fw-bold">David Dev</span>
          <span class="fs-12 fw-semibold">Art Director</span>
        </Link>
      </div>

      
        <BDropdown :variant="null" no-caret placement="bottom-end" toggle-class="link-reset sidenav-user-set-icon border-0 p-0" offset="7">
          <template #button-content>
            <Icon icon="settings" class="fs-24 align-middle ms-1" />
          </template>

          <BDropdownHeader class="noti-title">
            <h6 class="text-overflow m-0">Welcome back!</h6>
          </BDropdownHeader>

          <Link href="#" class="dropdown-item">
            <Icon icon="user-circle" class="me-1 fs-lg align-middle" />
            <span class="align-middle">Profile</span>
          </Link>

          <Link href="#" class="dropdown-item">
            <Icon icon="settings-2" class="me-1 fs-lg align-middle" />
            <span class="align-middle">Account Settings</span>
          </Link>

          <Link href="/user/lock-screen" class="dropdown-item">
            <Icon icon="lock" class="me-1 fs-lg align-middle" />
            <span class="align-middle">Lock Screen</span>
          </Link>

          <Link href="#" class="dropdown-item text-danger fw-semibold">
            <Icon icon="logout" class="me-1 fs-lg align-middle" />
            <span class="align-middle">Log Out</span>
          </Link>
        </BDropdown>
      
    </div>
  </div>
</template>

<script setup lang="ts">
import { Link } from '@inertiajs/vue3';
import Icon from '@/components/wrappers/Icon.vue'
</script>
