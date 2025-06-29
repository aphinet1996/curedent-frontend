// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL || 'http://localhost:3001',
      // socketUrl: process.env.NUXT_PUBLIC_SOCKET_URL || 'http://localhost:3001',
    }
  },
  css: ['~/assets/css/input.css'],
  vite: {
    optimizeDeps: {
      exclude: ['json']
    },
    build: {
      commonjsOptions: {
        transformMixedEsModules: true
      }
    },
    plugins: [
      tailwindcss(),
    ],
    server: {
      allowedHosts: ['https://1302-27-55-94-39.ngrok-free.app', 'lawrence-registered-juvenile-updates.trycloudflare.com']
    }
  },
  modules: [
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxt/test-utils',
    '@pinia/nuxt',
    '@nuxtjs/i18n',
    '@nuxtjs/google-fonts',
    'nuxt-emoji-picker'
  ],
  icon: {
    serverBundle: {
      collections: ['streamline', 'prime', 'mdi', 'ri']
    }
  },
  googleFonts: {
    families: {
      Kanit: {
        wght: [400, 500, 600, 700]
      }
    },
    display: 'swap'
  },
  i18n: {
    langDir: 'locales',
    locales: [
      {
        code: 'th',
        iso: 'th-TH',
        file: 'th.json',
        name: 'ไทย'
      },
      {
        code: 'en',
        iso: 'en-US',
        file: 'en.json',
        name: 'English'
      }
    ],
    defaultLocale: 'th',
    // strategy: 'prefix_except_default',
    strategy: 'prefix',
    restructureDir: false,
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root',
      alwaysRedirect: false,
      cookieCrossOrigin: false,
      cookieDomain: null,
      cookieSecure: false,
      fallbackLocale: 'th'
    },

    compilation: {
      strictMessage: false,
      escapeHtml: false
    },

    lazy: true,
  }
})