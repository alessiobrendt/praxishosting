<template>
    <div class="wrapper">
        <Topbar />

        <MobileMenu v-if="isMobile || layout.sidenavSize === 'offcanvas'" />
        <HorizontalNav v-else />

        <div class="content-page">
            <BContainer fluid>
                <slot />
            </BContainer>
            <Footer />
        </div>

        <Customizer />
    </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import Topbar from '@/layouts/components/topbar/index.vue';
import Customizer from '@/layouts/components/customizer/index.vue';
import Footer from '@/layouts/components/footer/index.vue';
import HorizontalNav from '@/layouts/components/horizontal-nav/index.vue';
import MobileMenu from '@/layouts/components/mobile-menu/index.vue';
import { useLayout } from '@/stores/layout';
import { useMobile } from '@/composables/useMobile';

const { isMobile } = useMobile();
const layoutStore = useLayout();
const { layout } = storeToRefs(layoutStore);
</script>
