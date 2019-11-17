import React from 'react'

let installPlugin = window.installPlugin

installPlugin(createPlugin => {
  return createPlugin((context, modal) => {
    context.activatePlugin('unlock-terminal')
    context.dispatch({ type: 'MOUNT_MAIN_COMPONENT', component: 'Hola Mundo!' })
    let timer = setTimeout(() => {
      context.dispatch({ type: 'UNMOUNT_MAIN_COMPONENT' })
    }, 10000)
    return () => {
      clearTimeout(timer)
    }
  }, ['modal-dialog', 'activate-terminal', 'display-manager'])
})