import React from 'react'
import { useGlobalContext, usePlugin } from '../core/GlobalContext'

let immutable = require('object-path-immutable')

function displayManagerReducer(state, action) {
  switch(action.type) {
    case 'MOUNT_MAIN_COMPONENT':
      return immutable.set(state, 'storage.display-manager.main-component', action.component)
    case 'UNMOUNT_MAIN_COMPONENT':
      return immutable.del(state, 'storage.display-manager.main-component')
    default:
      return state
  }
}

export default function DisplayManagerPlugin(props) {
  let context = useGlobalContext()

  usePlugin(() => {
    context.registerReducer(displayManagerReducer)
    context.activatePlugin('display-manager')
  })

  return <div>{context.get('storage.display-manager.main-component', <></>)}</div>
}