<script setup lang="ts">
withDefaults(
    defineProps<{
        size?: number;
    }>(),
    { size: 300 },
);
</script>

<template>
    <div class="inline-flex shrink-0" role="status" aria-label="Laden">
        <svg :width="size" :height="size" viewBox="0 0 5000 5000" class="loading-animation-svg">
            <path
                class="draw"
                pathLength="1"
                fill="none"
                stroke="currentColor"
                stroke-width="180"
                d="M2392.262,933.733l317.866,544.923l-385.569,679.95l-458.185,-788.716l-1015.955,1792.377l-782.714,0l1287.948,-2228.534l1036.609,0Z"
            />
            <path
                class="draw draw-2"
                pathLength="1"
                fill="none"
                stroke="currentColor"
                stroke-width="180"
                d="M1783.738,3462.267l-317.866,-544.923l385.569,-679.95l458.185,788.716l1015.955,-1792.377l782.714,0l-1287.948,2228.534l-1036.609,0Z"
            />
        </svg>
        <span class="sr-only">Laden...</span>
    </div>
</template>

<style scoped>
.loading-animation-svg {
    color: var(--loading-primary, #014874);
}

.loading-animation-svg .draw-2 {
    color: var(--loading-secondary, #72c825);
}

.draw {
    stroke-dasharray: 1;
    stroke-dashoffset: 1;
    stroke-linecap: round;
    stroke-linejoin: round;
    animation: draw 2s ease forwards;
}

.draw-2 {
    animation-delay: 1.2s;
}

@keyframes draw {
    to {
        stroke-dashoffset: 0;
    }
}
</style>
