export default defineNuxtConfig({
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@vueuse/nuxt',
    '@nuxtjs/color-mode'
  ],
  colorMode: {
    classSuffix: ''
  },
  runtimeConfig: {
    public: {
      postDataWebhookUrl: process.env.POST_DATA_WEBHOOK_URL
    }
  },
  devtools: { enabled: false }
})