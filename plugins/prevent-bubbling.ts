export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('prevent-bubbling', {
    mounted(el) {
      el.addEventListener('click', (e) => {
        e.stopPropagation();
      }, true);
    },
    unmounted(el) {
      el.removeEventListener('click', (e) => {
        e.stopPropagation();
      }, true);
    }
  });
});