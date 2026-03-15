<template>
  <div id="apps-dropdown-grid" class="topbar-item">
    <BDropdown placement="bottom-end" :variant="null" no-caret toggle-class="topbar-link" menu-class="dropdown-menu-lg p-2" offset="5">
      <template #button-content>
        <span class="topbar-link-icon">
          <Icon icon="apps" />
        </span>
      </template>

      <BRow class="align-items-center g-1">
        <BCol cols="4">
          <BDropdownItem href="" class="border border-dashed rounded text-center py-2">
            <span class="avatar-sm d-block mx-auto mb-1">
              <span class="avatar-title text-bg-light rounded-circle">
                <img src="/images/logos/google.svg" alt="Google Logo" height="18" />
              </span>
            </span>
            <span class="align-middle fw-medium">Google</span>
          </BDropdownItem>
        </BCol>

        <BCol cols="4">
          <BDropdownItem href="" class="border border-dashed rounded text-center py-2">
            <span class="avatar-sm d-block mx-auto mb-1">
              <span class="avatar-title text-bg-light rounded-circle">
                <img src="/images/logos/figma.svg" alt="Figma Logo" height="18" />
              </span>
            </span>
            <span class="align-middle fw-medium">Figma</span>
          </BDropdownItem>
        </BCol>

        <BCol cols="4">
          <BDropdownItem href="" class="border border-dashed rounded text-center py-2">
            <span class="avatar-sm d-block mx-auto mb-1">
              <span class="avatar-title text-bg-light rounded-circle">
                <img src="/images/logos/slack.svg" alt="Slack Logo" height="18" />
              </span>
            </span>
            <span class="align-middle fw-medium">Slack</span>
          </BDropdownItem>
        </BCol>

        <BCol cols="4">
          <BDropdownItem href="" class="border border-dashed rounded text-center py-2">
            <span class="avatar-sm d-block mx-auto mb-1">
              <span class="avatar-title text-bg-light rounded-circle">
                <img src="/images/logos/dropbox.svg" alt="Dropbox Logo" height="18" />
              </span>
            </span>
            <span class="align-middle fw-medium">Dropbox</span>
          </BDropdownItem>
        </BCol>

        <BCol cols="4" class="text-center">
          <RouterLink to="" class="btn btn-sm rounded-circle btn-icon btn-danger">
            <Icon icon="circle-dashed-plus" class="fs-18" />
          </RouterLink>
        </BCol>

        <BCol cols="4">
          <BDropdownItem href="" class="border border-dashed rounded text-center py-2">
            <span class="avatar-sm d-block mx-auto mb-1">
              <span class="avatar-title bg-primary-subtle text-primary rounded-circle">
                <Icon icon="calendar" class="fs-18" />
              </span>
            </span>
            <span class="align-middle fw-medium">Calendar</span>
          </BDropdownItem>
        </BCol>

        <BCol cols="4">
          <BDropdownItem href="" class="border border-dashed rounded text-center py-2">
            <span class="avatar-sm d-block mx-auto mb-1">
              <span class="avatar-title bg-primary-subtle text-primary rounded-circle">
                <Icon icon="message-circle" class="fs-18" />
              </span>
            </span>
            <span class="align-middle fw-medium">Chat</span>
          </BDropdownItem>
        </BCol>

        <BCol cols="4">
          <BDropdownItem href="" class="border border-dashed rounded text-center py-2">
            <span class="avatar-sm d-block mx-auto mb-1">
              <span class="avatar-title bg-primary-subtle text-primary rounded-circle">
                <Icon icon="folder" class="fs-18" />
              </span>
            </span>
            <span class="align-middle fw-medium">Files</span>
          </BDropdownItem>
        </BCol>

        <BCol cols="4">
          <BDropdownItem href="" class="border border-dashed rounded text-center py-2">
            <span class="avatar-sm d-block mx-auto mb-1">
              <span class="avatar-title bg-primary-subtle text-primary rounded-circle">
                <Icon icon="users" class="fs-18" />
              </span>
            </span>
            <span class="align-middle fw-medium">Team</span>
          </BDropdownItem>
        </BCol>
      </BRow>
    </BDropdown>
  </div>
</template>

<script setup lang="ts">
import { BRow } from 'bootstrap-vue-next'
import Icon from '~/components/wrappers/Icon.vue'
</script>
