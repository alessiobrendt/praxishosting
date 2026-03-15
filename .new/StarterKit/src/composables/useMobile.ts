import { useMediaQuery } from '@vueuse/core'
import { onMounted, ref, watch } from 'vue'

export const useMobile = () => {
  const isMobileQuery = useMediaQuery('(max-width: 992px)')

  const isMobile = ref<boolean | null>(null)

  onMounted(() => {
    isMobile.value = isMobileQuery.value

    watch(isMobileQuery, (val) => {
      isMobile.value = val
    })
  })

  return {
    isMobile,
  }
}
