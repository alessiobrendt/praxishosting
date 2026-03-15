<template>
  <div class="p-3 border-bottom border-dashed">
    <h5 class="mb-3 fw-bold">Select Theme</h5>
    <BRow class="g-3">
      <BCol cols="6" v-for="option in skinOptions" :key="option.value">
        <div class="form-check card-radio">
          <input class="form-check-input" type="radio" name="data-skin" :id="`demo-skin-${option.value}`" :value="option.value" :checked="layout.skin === option.value" @change="() => updateLayout({ skin: option.value })" />
          <label class="form-check-label p-0 w-100" :for="`demo-skin-${option.value}`">
            <img :src="option.image" alt="layout-img" class="img-fluid" />
          </label>
        </div>
        <h5 class="text-center text-muted mt-2 mb-0">{{ toPascalCase(option.value) }}</h5>
      </BCol>
    </BRow>
  </div>
</template>

<script setup lang="ts">
import type { CustomizationOptionType } from '@/layouts/components/customizer/index.vue'
import { toPascalCase } from '@/utils/helpers'
import { useLayout } from '@/stores/layout'
import { storeToRefs } from 'pinia'

const defaultImg = '/images/layouts/skin-default.png'
const elegantImg = '/images/layouts/skin-elegant.png'
const flatImg = '/images/layouts/skin-flat.png'
const galaxyImg = '/images/layouts/skin-galaxy.png'
const luxeImg = '/images/layouts/skin-luxe.png'
const materialImg = '/images/layouts/skin-material.png'
const matrixImg = '/images/layouts/skin-matrix.png'
const minimalImg = '/images/layouts/skin-minimal.png'
const modernImg = '/images/layouts/skin-modern.png'
const monoImg = '/images/layouts/skin-mono.png'
const neoImg = '/images/layouts/skin-neo.png'
const neonImg = '/images/layouts/skin-neon.png'
const novaImg = '/images/layouts/skin-nova.png'
const pixelImg = '/images/layouts/skin-pixel.png'
const prismImg = '/images/layouts/skin-prism.png'
const retroImg = '/images/layouts/skin-retro.png'
const saasImg = '/images/layouts/skin-saas.png'
const silverImg = '/images/layouts/skin-silver.png'
const softImg = '/images/layouts/skin-soft.png'
const vividImg = '/images/layouts/skin-vivid.png'
const xenonImg = '/images/layouts/skin-xenon.png'
const zenImg = '/images/layouts/skin-zen.png'
const orbitImg = '/images/layouts/skin-orbit.png'
const auroraImg = '/images/layouts/skin-aurora.png'
const crystalImg = '/images/layouts/skin-crystal.png'

const skinOptions: CustomizationOptionType[] = [
  { value: 'default', image: defaultImg },
  { value: 'minimal', image: minimalImg },
  { value: 'modern', image: modernImg },
  { value: 'material', image: materialImg },
  { value: 'saas', image: saasImg },
  { value: 'flat', image: flatImg },
  { value: 'galaxy', image: galaxyImg },
  { value: 'luxe', image: luxeImg },
  { value: 'retro', image: retroImg },
  { value: 'neon', image: neonImg },
  { value: 'pixel', image: pixelImg },
  { value: 'soft', image: softImg },
  { value: 'mono', image: monoImg },
  { value: 'prism', image: prismImg },
  { value: 'nova', image: novaImg },
  { value: 'zen', image: zenImg },
  { value: 'elegant', image: elegantImg },
  { value: 'vivid', image: vividImg },
  { value: 'aurora', image: auroraImg },
  { value: 'crystal', image: crystalImg },
  { value: 'matrix', image: matrixImg },
  { value: 'orbit', image: orbitImg },
  { value: 'neo', image: neoImg },
  { value: 'silver', image: silverImg },
  { value: 'xenon', image: xenonImg },
]

const layoutStore = useLayout()

const { layout } = storeToRefs(layoutStore)
const { updateLayout } = layoutStore
</script>
