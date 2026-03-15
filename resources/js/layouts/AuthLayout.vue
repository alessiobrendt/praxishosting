<template>
    <div class="position-absolute top-0 end-0">
        <img src="/images/auth-card-bg.svg" class="auth-card-bg-img" alt="auth-card-bg" />
    </div>
    <div class="position-absolute start-0 bottom-0" style="transform: rotate(180deg)">
        <img src="/images/auth-card-bg.svg" class="auth-card-bg-img" alt="auth-card-bg" />
    </div>
    <div class="auth-box overflow-hidden align-items-center d-flex">
        <BContainer>
            <BRow class="justify-content-center">
                <BCol xxl="5" md="6" sm="8">
                    <BCard no-body class="p-4">
                        <div class="auth-brand text-center mb-4">
                            <AuthLogo />
                            <h4 class="fw-bold text-dark mt-3">{{ title }}</h4>
                            <p class="text-muted w-lg-75 mx-auto">{{ description }}</p>
                        </div>
                        <slot />
                    </BCard>
                </BCol>
            </BRow>
        </BContainer>
    </div>
</template>

<script setup lang="ts">
import { BContainer, BRow, BCol, BCard } from 'bootstrap-vue-next';
import AuthLogo from '@/components/AuthLogo.vue';

withDefaults(
    defineProps<{
        title?: string;
        description?: string;
    }>(),
    {
        title: '',
        description: '',
    },
);
</script>
