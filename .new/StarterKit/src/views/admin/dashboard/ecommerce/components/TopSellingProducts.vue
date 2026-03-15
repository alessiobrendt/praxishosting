<template>
  <BCard no-body class="card-h-100">
    <BCardHeader class="justify-content-between">
      <BCardTitle>Top Selling Products</BCardTitle>
      <div>
        <RouterLink to="" class="btn btn-sm btn-default me-1"><Icon icon="cloud-upload" class="me-1" /> Export</RouterLink>
        <RouterLink to="" class="btn btn-sm btn-light"><Icon icon="download" class="me-1" /> Import</RouterLink>
      </div>
    </BCardHeader>
    <BCardBody class="p-0">
      <BTable
        show-empty
        :filter="searchQuery"
        empty-text="Nothing found."
        thead-class="d-none"
        hover
        :fields="fields"
        :items="products"
        :per-page="perPage"
        :current-page="currentPage"
        @filtered="onFiltered"
        responsive
        class="table-custom table-centered table-hover w-100 mb-0"
        tbody-class="text-nowrap"
      >
        <template #cell(product)="{ item }">
          <img :src="item.image" alt="product-pic" height="36" />
        </template>
        <template #cell(name)="{ item }">
          <h5 class="m-0 fs-base">{{ item.name }}</h5>
          <span class="text-muted fs-xs">By: {{ item.brand }}</span>
        </template>
        <template #cell(price)="{ item }">
          <h5 class="m-0 fs-base">{{ item.price }}</h5>
          <span class="text-muted fs-xs">Price</span>
        </template>
        <template #cell(quantity)="{ item }">
          <h5 class="m-0 fs-base">{{ item.quantity }}</h5>
          <span class="text-muted fs-xs">Quantity</span>
        </template>
        <template #cell(amount)="{ item }">
          <h5 class="m-0 fs-base">{{ item.amount }}</h5>
          <span class="text-muted fs-xs">Amount</span>
        </template>
        <template #cell(status)="{ item }">
          <span :class="['badge px-2 py-1 rounded-pill fs-12', item.status === 'out-of-stock' ? 'bg-danger-subtle text-danger' : item.status === 'in-stock' ? 'bg-success-subtle text-success' : 'bg-warning-subtle text-warning']"> {{ toPascalCase(item.status) }} </span>
        </template>
      </BTable>
    </BCardBody>

    <BCardFooter class="border-0">
      <TablePagination v-model:currentPage="currentPage" :per-page="perPage" :total-items="totalRows" label="products" />
    </BCardFooter>
  </BCard>
</template>

<script setup lang="ts">
import type { TableFieldRaw } from 'bootstrap-vue-next'
import { ref } from 'vue'
import TablePagination from '~/components/TablePagination.vue'
import Icon from '~/components/wrappers/Icon.vue'
import { toPascalCase } from '~/utils/helpers'
import { productData, type ProductType } from './data'

const fields: Exclude<TableFieldRaw<ProductType>, string>[] = [
  { key: 'product', label: 'Product', sortable: true },
  { key: 'name', label: 'Name', sortable: true },
  { key: 'price', label: 'Price', sortable: true },
  { key: 'quantity', label: 'Quantity', sortable: true },
  { key: 'amount', label: 'Amount', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
]

const searchQuery = ref('')

const currentPage = ref(1)
const perPage = ref(6)
const totalRows = ref(productData.length)
const products = ref<ProductType[]>(productData)

function onFiltered(filteredItems: ProductType[]) {
  totalRows.value = filteredItems.length
  currentPage.value = 1
}
</script>
