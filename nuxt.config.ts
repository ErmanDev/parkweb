// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2026-03-31',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss'],
  css: ['~/assets/style.css'],

  runtimeConfig: {
    public: {
      /** Set on Vercel to your Render URL, e.g. https://stunbning.onrender.com */
      apiBase: process.env.NUXT_PUBLIC_API_BASE || "",
    },
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