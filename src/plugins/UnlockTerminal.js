import React from 'react'
import { useGlobalContext, usePlugin } from '../core/GlobalContext'

export function UnlockTerminal(props) {
  let context = useGlobalContext()

  usePlugin(() => {
    context.activatePlugin('unlock-terminal')
  }, ['activate-terminal'])

  return <></>
}