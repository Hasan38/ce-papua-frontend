import { createApp as createClientApp } from 'vue'

import { createHead } from '@unhead/vue'
import { InferSeoMetaPlugin } from '@unhead/addons'
import { createPinia } from 'pinia'
import { createRouter } from './router'
import VueroApp from './VueroApp.vue'
import './styles'

export type VueroAppContext = Awaited<ReturnType<typeof createApp>>
export type VueroPlugin = (vuero: VueroAppContext) => void | Promise<void>

const plugins = import.meta.glob<{ default: VueroPlugin }>('./plugins/*.ts')

// this is a helper function to define plugins with autocompletion
export function definePlugin(plugin: VueroPlugin) {
  return plugin
}

export async function createApp() {
  const app = createClientApp(VueroApp)
  const router = createRouter()

  const head = createHead({
    plugins: [InferSeoMetaPlugin()],
  })
  app.use(head)

  const pinia = createPinia()
  app.use(pinia)

  const hcspapua = {
    app,
    router,
    head,
    pinia,
  }

  app.provide('hcspapua', hcspapua)

  for (const path in plugins) {
    try {
      const { default: plugin } = await plugins[path]()
      await plugin(hcspapua)
    }
    catch (error) {
      console.error(`Error while loading plugin "${path}".`)
      console.error(error)
    }
  }

  // use router after plugin registration, so we can register navigation guards
  app.use(hcspapua.router)

  return hcspapua
}
