// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2026-03-31',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss'],
  css: ['~/assets/style.css'],

  runtimeConfig: {
    public: {
      /**
       * Override API host (e.g. https://parkweb.onrender.com).
       * Leave empty: localhost uses /api; Vercel uses Render URL; Render site uses /api.
       */
      apiBase:
        process.env.NUXT_PUBLIC_API_BASE ||
        (process.env.VERCEL ? "https://parkweb.onrender.com" : ""),
    },
  },

  routeRules: process.env.VERCEL
    ? {
        "/api/**": {
          proxy: "https://parkweb.onrender.com/api/**",
        },
      }
    : {},

  nitro: {
    preset: process.env.VERCEL ? "vercel" : "node-server",
  },

  vite: {
    optimizeDeps: {
      include: [
        '@vue/devtools-core',
        '@vue/devtools-kit'
      ]
    }
  }
})