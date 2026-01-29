<script setup lang="ts">
import Header from '~/components/Header.vue';
import Footer from '~/components/Footer.vue';

</script>

<template>
   <div class="flex flex-col min-h-screen">

  <div class="pb-12">
    <Header />
  </div>

  <main class="flex-1 p-4">
      <NuxtPage />
    </main>
  <Footer />
</div>
</template>
