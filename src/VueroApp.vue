<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { initDarkmode } from '/@src/stores/darkmode'

// This is the global app setup function
const { locale } = useI18n()

const rtlCodes = [
  'ar',
  'arc',
  'dv',
  'fa',
  'ha',
  'he',
  'khw',
  'ks',
  'ku',
  'ps',
  'ur',
  'yi',
]

useHead(() => ({
  title: 'HCS - Papua',
  link: [
    {
      rel: 'icon',
      href: '/favicon.svg',
      type: 'image/svg+xml',
    },
    {
      rel: 'alternate icon',
      href: '/favicon.ico',
      type: 'image/x-icon',
      sizes: '16x16',
    },
    {
      rel: 'apple-touch-icon',
      href: '/apple-touch-icon.png',
      type: 'image/png',
      sizes: '180x180',
    },
    {
      rel: 'mask-icon',
      href: '/favicon.svg',
      type: 'image/svg+xml',
      color: '#FFFFFF',
    },
  ],

  meta: [
    // Critical Tags
    { charset: 'utf-8' },

    {
      name: 'viewport',
      content: 'width=device-width, initial-scale=1, shrink-to-fit=no',
    },
    // PWA theme color
    {
      name: 'theme-color',
      content: '#ffffff',
    },
    {
      name: 'msapplication-TileColor',
      content: '#232326',
    },
    // SEO
    {
      name: 'robots',
      content: 'index,follow,max-image-preview:large',
    },
    {
      name: 'description',
      content:
        'HCS Papua',
    },
    // Open Graph
    {
      property: 'og:site_name',
      content: 'HCS Papua by Hasan Revastt',
    },
    {
      property: 'og:locale',
      content: 'en_US',
    },
    {
      property: 'og:type',
      content: 'article',
    },
    {
      property: 'og:url',
      content: '',
    },
    {
      property: 'og:image:type',
      content: 'image/png',
    },
    {
      property: 'og:image:width',
      content: '1200',
    },
    {
      property: 'og:image:height',
      content: '630',
    },
    {
      property: 'og:image',
      content:
        '',
    },
    // Twitter
    {
      name: 'twitter:site',
      content: '@hasanrevastt',
    },
  ],
  htmlAttrs: {
    lang: locale.value,
    dir: rtlCodes.includes(locale.value) ? 'rtl' : 'ltr',
  },
}))

/**
 * Initialize the darkmode watcher
 *
 * @see /@src/stores/darkmode
 */
initDarkmode()
</script>

<template>
  <div>
    <Suspense>
      <RouterView v-slot="{ Component }">
        <Transition
          name="fade-slow"
          mode="out-in"
        >
          <component :is="Component" />
        </Transition>
      </RouterView>
    </Suspense>
    <ClientOnly>
      <VReloadPrompt app-name="hcspapua" />
    </ClientOnly>
  </div>
</template>
