<template>
  <BCard no-body class="card-h-100">
    <BCardHeader class="justify-content-between">
      <BCardTitle>Recent Orders <span class="text-muted fs-base fw-normal">(186.25k Transactions)</span></BCardTitle>
      <div>
        <RouterLink to="" class="btn btn-sm btn-default me-1"> <Icon icon="cloud-upload" class="me-1" /> Export </RouterLink>
        <RouterLink to="" class="btn btn-sm btn-light"> <Icon icon="download" class="me-1" /> Import </RouterLink>
      </div>
    </BCardHeader>

    <BCardBody class="p-0">
      <BTable
        show-empty
        :filter="searchQuery"
        empty-text="Nothing found."
        thead-class="bg-light align-middle bg-opacity-25 thead-sm"
        hover
        :fields="fields"
        :items="orders"
        :per-page="perPage"
        :current-page="currentPage"
        @filtered="onFiltered"
        responsive
        class="table-custom table-centered table-hover w-100 mb-0"
        tr-class="text-uppercase table-nowrap fs-xxs"
      >
        <template #head()="data">
          <span class="text-uppercase fs-xxs">{{ data.label }}</span>
        </template>
        <template #cell(customer)="{ item }">
          <h5 class="m-0 fs-base">{{ item.customer.name }}</h5>
          <span class="text-muted fs-xs">{{ item.customer.email }}</span>
        </template>
        <template #cell(status)="{ item }">
          <span :class="['badge', item.status === 'pending' ? 'bg-warning-subtle text-warning' : item.status === 'completed' ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger']"> {{ toPascalCase(item.status) }} </span>
        </template>
      </BTable>
    </BCardBody>

    <BCardFooter class="border-0">
      <TablePagination v-model:currentPage="currentPage" :per-page="perPage" :total-items="totalRows" label="orders" />
    </BCardFooter>
  </BCard>
</template>

<script setup lang="ts">
import Icon from '~/components/wrappers/Icon.vue'
import { orderData, type OrderType } from './data'
import type { TableFieldRaw } from 'bootstrap-vue-next'
import { toPascalCase } from '~/utils/helpers'
import { ref } from 'vue'

const fields: Exclude<TableFieldRaw<OrderType>, string>[] = [
  { key: 'id', label: 'ID', sortable: true },
  { key: 'customer', label: 'Customer', sortable: true },
  { key: 'date', label: 'Date', sortable: true },
  { key: 'amount', label: 'Amount', sortable: true },
  { key: 'payment', label: 'Payment', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
]

const searchQuery = ref('')

const currentPage = ref(1)
const perPage = ref(5)
const totalRows = ref(orderData.length)
const orders = ref<OrderType[]>(orderData)

function onFiltered(filteredItems: OrderType[]) {
  totalRows.value = filteredItems.length
  currentPage.value = 1
}
</script>
