import Modal from './components/Modal.vue'
import Dialog from './components/Dialog.vue'
import PluginCore from './PluginCore'

const Plugin = {
  install(app, options = {}) {
    if (app.config.globalProperties.$modal) {
      return
    }

    const plugin = PluginCore(options)

    app.config.globalProperties.$modal = plugin
    app.provide('$modal', plugin)

    app.mixin({
      mounted() {
        if (this.$root === this) {
          if (!plugin.context.root) {
            plugin.setDynamicModalContainer(this)
          }
        }
      }
    })

    app.component(plugin.context.componentName, Modal)

    if (options.dialog) {
      app.component('Dialog', Dialog)
    }
  }
}

export default Plugin
