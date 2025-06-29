// import VueApexCharts from 'vue3-apexcharts'
// export default defineNuxtPlugin(nuxtApp => {
//   nuxtApp.vueApp.component('apexchart', VueApexCharts)
// })

// import VueApexCharts from "vue3-apexcharts"
// export default defineNuxtPlugin((nuxtApp) => {
//   nuxtApp.vueApp.use(VueApexCharts)
// })

import VueApexCharts from 'vue3-apexcharts';
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(VueApexCharts);
});
