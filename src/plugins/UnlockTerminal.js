import React from 'react'
import { useGlobalContext, usePlugin } from '../core/GlobalContext'

function createPlugin(plugin, dependencies) {
  let Component = function(props) {
    let context = useGlobalContext()
    usePlugin(plugin.bind(null, context), dependencies)
    return <></>
  }
  return Component
}

export default createPlugin((context, modal) => {
  context.activatePlugin('unlock-terminal')
  context.dispatch({ type: 'MOUNT_MAIN_COMPONENT', component: <h1>Hola Mundo!</h1> })
  setTimeout(() => {
    context.dispatch({ type: 'UNMOUNT_MAIN_COMPONENT' })
  }, 10000)
}, ['modal-dialog', 'activate-terminal', 'display-manager'])

/*
export default function UnlockTerminalPlugin(props) {
  let context = useGlobalContext()

  usePlugin(() => {
    context.activatePlugin('unlock-terminal')
  }, ['activate-terminal'])

  return <></>
}
*/