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
}, ['modal-dialog', 'activate-terminal'])

/*
export default function UnlockTerminalPlugin(props) {
  let context = useGlobalContext()

  usePlugin(() => {
    context.activatePlugin('unlock-terminal')
  }, ['activate-terminal'])

  return <></>
}
*/