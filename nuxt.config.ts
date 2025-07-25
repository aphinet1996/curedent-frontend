import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL,
      // socketUrl: process.env.NUXT_PUBLIC_SOCKET_URL,
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
      allowedHosts: ['https://1302-27-55-94-39.ngrok-free.app']
    }
  },
  modules: [
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxt/test-utils',
    '@nuxt/ui',
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
    // strategy: 'prefix_except_default',
    strategy: 'prefix',
    defaultLocale: 'th',
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