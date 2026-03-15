<template>
    <div
        v-if="loading"
        class="position-fixed top-0 start-0 d-flex justify-content-center align-items-center bg-white"
        :style="{ height: '100%', width: '100vw', zIndex: 9999 }"
    >
        <BSpinner variant="primary" />
    </div>
</template>

<script setup lang="ts">
import { BSpinner } from 'bootstrap-vue-next';
import { ref } from 'vue';
import { onMounted } from 'vue';

const loading = ref(true);

onMounted(() => {
    loading.value = false;
});
</script>
