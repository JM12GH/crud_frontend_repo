// nuxt.config.ts
import { defineNuxtConfig } from 'nuxt/config';

export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  css: [
    '@/assets/css/global.css',
  ],

  modules: [
    '@nuxtjs/tailwindcss', 
    '@nuxt/icon',
    '@pinia/nuxt'
  ],

  runtimeConfig: {
    public: {
     
    },
  },
  plugins: [
    '~/plugins/axios.ts',
    
  ],
});