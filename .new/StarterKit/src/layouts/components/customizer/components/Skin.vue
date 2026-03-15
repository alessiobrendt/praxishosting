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
import type { CustomizationOptionType } from '~/layouts/components/customizer/index.vue'
import { toPascalCase } from '~/utils/helpers'
import { useLayout } from '~/stores/layout'
import { storeToRefs } from 'pinia'

import defaultImg from '/images/layouts/skin-default.png'
import elegantImg from '/images/layouts/skin-elegant.png'
import flatImg from '/images/layouts/skin-flat.png'
import galaxyImg from '/images/layouts/skin-galaxy.png'
import luxeImg from '/images/layouts/skin-luxe.png'
import materialImg from '/images/layouts/skin-material.png'
import matrixImg from '/images/layouts/skin-matrix.png'
import minimalImg from '/images/layouts/skin-minimal.png'
import modernImg from '/images/layouts/skin-modern.png'
import monoImg from '/images/layouts/skin-mono.png'
import neoImg from '/images/layouts/skin-neo.png'
import neonImg from '/images/layouts/skin-neon.png'
import novaImg from '/images/layouts/skin-nova.png'
import pixelImg from '/images/layouts/skin-pixel.png'
import prismImg from '/images/layouts/skin-prism.png'
import retroImg from '/images/layouts/skin-retro.png'
import saasImg from '/images/layouts/skin-saas.png'
import silverImg from '/images/layouts/skin-silver.png'
import softImg from '/images/layouts/skin-soft.png'
import vividImg from '/images/layouts/skin-vivid.png'
import xenonImg from '/images/layouts/skin-xenon.png'
import zenImg from '/images/layouts/skin-zen.png'
import orbitImg from '/images/layouts/skin-orbit.png'
import auroraImg from '/images/layouts/skin-aurora.png'
import crystalImg from '/images/layouts/skin-crystal.png'

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
