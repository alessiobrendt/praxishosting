<template>
  <div id="megamenu-columns" class="topbar-item d-none d-md-flex">
    
      <BDropdown :variant="null" toggle-class="topbar-link btn fw-medium btn-link drop-arrow-none" menu-class="dropdown-menu-xxl p-0">
        <template #button-content>
          Mega Menu
          <Icon icon="chevron-down" class="ms-1" />
        </template>

        <simplebar class="h-100" style="max-height: 380px">
          <BRow class="g-0">
            <BCol md="4">
              <div class="p-2">
                <h5 class="mb-1 fw-semibold fs-sm dropdown-header">Dashboard & Analytics</h5>
                <ul class="list-unstyled megamenu-list">
                  <BDropdownItem href="">
                    <Icon icon="chevron-right" class="align-middle me-1 text-muted" />
                    Sales Dashboard
                  </BDropdownItem>
                  <BDropdownItem href="">
                    <Icon icon="chevron-right" class="align-middle me-1 text-muted" />
                    Marketing Dashboard
                  </BDropdownItem>
                  <BDropdownItem href="">
                    <Icon icon="chevron-right" class="align-middle me-1 text-muted" />
                    Finance Overview
                  </BDropdownItem>
                  <BDropdownItem href="">
                    <Icon icon="chevron-right" class="align-middle me-1 text-muted" />
                    User Analytics
                  </BDropdownItem>
                  <BDropdownItem href="">
                    <Icon icon="chevron-right" class="align-middle me-1 text-muted" />
                    Traffic Insights
                  </BDropdownItem>
                </ul>
              </div>
            </BCol>

            <BCol md="4">
              <div class="p-2">
                <h5 class="mb-1 fw-semibold fs-sm dropdown-header">Project Management</h5>
                <ul class="list-unstyled megamenu-list">
                  <BDropdownItem href="">
                    <Icon icon="minus" class="align-middle me-1 text-muted" />
                    Kanban Workflow
                  </BDropdownItem>
                  <BDropdownItem href="">
                    <Icon icon="minus" class="align-middle me-1 text-muted" />
                    Project Timeline
                  </BDropdownItem>
                  <BDropdownItem href="">
                    <Icon icon="minus" class="align-middle me-1 text-muted" />
                    Task Management
                  </BDropdownItem>
                  <BDropdownItem href="">
                    <Icon icon="minus" class="align-middle me-1 text-muted" />
                    Team Members
                  </BDropdownItem>
                  <BDropdownItem href="">
                    <Icon icon="minus" class="align-middle me-1 text-muted" />
                    Assignments
                  </BDropdownItem>
                </ul>
              </div>
            </BCol>

            <BCol md="4">
              <div class="p-2 bg-light bg-opacity-50">
                <h5 class="mb-1 fw-semibold fs-sm dropdown-header">User Management</h5>
                <ul class="list-unstyled megamenu-list">
                  <BDropdownItem href="">
                    <Icon icon="chevron-right" class="align-middle me-1 text-muted" />
                    User Profiles
                  </BDropdownItem>
                  <BDropdownItem href="">
                    <Icon icon="chevron-right" class="align-middle me-1 text-muted" />
                    Access Control
                  </BDropdownItem>
                  <BDropdownItem href="">
                    <Icon icon="chevron-right" class="align-middle me-1 text-muted" />
                    Security Settings
                  </BDropdownItem>
                  <BDropdownItem href="">
                    <Icon icon="chevron-right" class="align-middle me-1 text-muted" />
                    User Groups
                  </BDropdownItem>
                  <BDropdownItem href="">
                    <Icon icon="chevron-right" class="align-middle me-1 text-muted" />
                    Authentication
                  </BDropdownItem>
                </ul>
              </div>
            </BCol>
          </BRow>
        </simplebar>
      </BDropdown>
    
  </div>
</template>

<script setup lang="ts">
import simplebar from 'simplebar-vue'
import Icon from '~/components/wrappers/Icon.vue'
</script>
