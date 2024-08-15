import { UNSUPPORTED_ARGUMENT_ERROR } from './utils/errors'
import { createDivInBody } from './utils'
import ModalsContainer from './components/ModalsContainer.vue'

const PluginCore = (Vue, options = {}) => {
  const subscription = new Vue()

  const context = {
    root: null,
    componentName: options.componentName || 'Modal'
  }

  const showStaticModal = (name, params) => {
    subscription.$emit('toggle', name, true, params)
  }

  const showDynamicModal = (
    component,
    componentProps,
    componentSlots,
    modalProps = componentSlots || {},
    modalEvents
  ) => {
    const container = context.root?.__modalContainer
    const defaults = options.dynamicDefaults || {}

    if (!container) {
      console.warn(
        'Modal container not found. Make sure the dynamic modal container is set.'
      )
      return
    }
    container.add(
      component,
      componentProps,
      componentSlots,
      { ...defaults, ...modalProps },
      modalEvents
    )
  }

  /**
   * Creates a container for modals in the root Vue component.
   *
   * @param {Vue} parent
   */
  const setDynamicModalContainer = (root) => {
    context.root = root

    if (!root) {
      console.warn(
        'Root component is undefined. Make sure the root instance is passed correctly.'
      )
      return
    }

    const element = createDivInBody()

    const vnode = createVNode(ModalsContainer)
    vnode.appContext = root.$.appContext

    try {
      return render(vnode, element)
    } catch (error) {
      console.error('Error rendering vnode:', error)
    }
  }

  const show = (...args) => {
    const [modal] = args

    switch (typeof modal) {
      case 'string':
        showStaticModal(...args)
        break

      case 'object':
      case 'function':
        showDynamicModal(...args)
        break

      default:
        console.warn(UNSUPPORTED_ARGUMENT_ERROR, modal)
    }
  }

  const hide = (name, params) => {
    subscription.$emit('toggle', name, false, params)
  }

  const hideAll = () => {
    subscription.$emit('hide-all')
  }

  const toggle = (name, params) => {
    subscription.$emit('toggle', name, undefined, params)
  }

  return {
    context,
    subscription,
    show,
    hide,
    hideAll,
    toggle,
    setDynamicModalContainer
  }
}

export default PluginCore
