import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/color-mode',
		'@nuxt/icon'
  ],
  colorMode: {
    classSuffix: '', // Tailwind CSS'in dark moduyla uyumlu çalışması için gerekli
    preference: 'system', // Varsayılan tercih
    fallback: 'dark', // Sistem tercihi yoksa veya desteklenmiyorsa kullanılacak tema
  },
  css: [
    '~/assets/css/tailwind.css'
  ],
  build: {
    transpile: []
  }
})
