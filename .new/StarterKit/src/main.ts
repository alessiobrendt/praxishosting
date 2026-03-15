import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { createBootstrap } from 'bootstrap-vue-next'
import VueApexCharts from "vue3-apexcharts";

import '~/assets/scss/app.scss'

import App from './app.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia().use(piniaPluginPersistedstate))
app.use(createBootstrap())
app.use(router)
app.component('VueApexCharts', VueApexCharts);

app.mount('#app')
