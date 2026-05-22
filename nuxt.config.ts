// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2026-03-31',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss'],
  css: ['~/assets/style.css'],

  runtimeConfig: {
    public: {
      /**
       * Optional: direct cross-origin API URL (needs CORS on Render).
       * Prefer leaving this empty on Vercel — vercel.json proxies /api/* to Render.
       */
      apiBase: process.env.NUXT_PUBLIC_API_BASE || "",
    },
  },

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