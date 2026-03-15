import { createRouter, createWebHistory } from 'vue-router'
import { allRoutes } from '~/router/routes.ts'
import { META_DATA } from '~/config/constants.ts'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: allRoutes,
})

router.beforeEach((to, from, next) => {
  const title = to.meta.title ? to.meta.title + ' | ' + META_DATA.title : META_DATA.title
  if (title) {
    document.title = title.toString()
  }
  next()
})

export default router
