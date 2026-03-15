<template>
  <PageBreadcrumb title="Compact" subtitle="Layouts" />

  <BContainer fluid="xl">
    <BRow>
      <BCol cols="12">
        <div class="alert alert-info alert-bordered border-start border-info d-flex align-items-start gap-2">
          <Icon icon="info-circle" class="fs-xxl" />
          <div>
            To use the compact layout, follow this structure: wrap your page title in
            <code>&lt;BContainer fluid&gt;</code>
            and place your main content inside
            <code>&lt;BContainer fluid="xl"&gt;</code>
            . This ensures proper spacing and alignment.
          </div>
        </div>
      </BCol>
    </BRow>

    <BRow>
      <BCol cols="12">
        <BCard no-body>
          <BCardBody class="text-center">
            <h4 class="m-0">Your custom content here</h4>
          </BCardBody>
        </BCard>
      </BCol>
    </BRow>
  </BContainer>
</template>

<script setup lang="ts">
import Icon from '~/components/wrappers/Icon.vue'
import PageBreadcrumb from '~/components/PageBreadcrumb.vue'
</script>
