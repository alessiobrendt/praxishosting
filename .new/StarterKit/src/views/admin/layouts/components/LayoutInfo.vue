<template>
  <BRow>
    <BCol cols="12">
      <div class="alert alert-info alert-bordered border-start border-info d-flex align-items-start gap-2">
        <Icon icon="info-circle" class="fs-xxl" />
        <div>
          To enable this layout, use <code>updateLayout</code> from <code>layout</code> store and pass <code>{ {{ option }} : "{{ value }}" }</code>. eg. <code>updateLayout({ {{ option }}: "{{ value }}" })</code>
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
</template>

<script setup lang="ts">
import Icon from '~/components/wrappers/Icon.vue'

type LayoutInfoProps = {
  option: string
  value: string
}

defineProps<LayoutInfoProps>()
</script>
