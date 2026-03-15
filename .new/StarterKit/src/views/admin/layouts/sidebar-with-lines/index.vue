<template>
  <PageBreadcrumb title="Sidebar With Lines" subtitle="Layouts" />
  <BRow>
    <BCol xs="12">
      <BAlert variant="info" show class="alert-bordered border-start border-info d-flex align-items-start gap-2">
        <Icon icon="info-circle" class="fs-xxl" />
        <div>
          If you want to display a line with each menu item, add the class
          <code>&quot;sidebar-with-line&quot;</code>
          to the
          <code>&lt;html&gt;</code>
          tag.
        </div>
      </BAlert>
    </BCol>
  </BRow>
  <BRow>
    <BCol xs="12">
      <BCard no-body>
        <BCardBody class="text-center">
          <h4 class="m-0">Your custom content here</h4>
        </BCardBody>
      </BCard>
    </BCol>
  </BRow>
</template>

<script setup lang="ts">
import PageBreadcrumb from '~/components/PageBreadcrumb.vue'
import { toggleAttribute } from '~/utils/helpers'
import { onMounted, onUnmounted } from 'vue'

onMounted(() => {
  toggleAttribute('class', 'sidebar-with-line')
})
</script>
