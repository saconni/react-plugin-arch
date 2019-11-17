import React from 'react'
import { useGlobalContext } from '../core/GlobalContext'
import { useExtension } from '../core/ExtensionManager'

let immutable = require('object-path-immutable')

let mainComponentPath = 'storage.display-manager.main-component'

function displayManagerReducer(state, action) {
  switch(action.type) {
    case 'MOUNT_MAIN_COMPONENT':
      return immutable.set(state, mainComponentPath, action.component)
    case 'UNMOUNT_MAIN_COMPONENT':
      return immutable.del(state, mainComponentPath)
    default:
      return state
  }
}

export default function DisplayManagerPlugin(props) {
  let context = useGlobalContext()

  useExtension(() => {
    context.registerReducer(displayManagerReducer)
    context.activatePlugin('display-manager')
  })

  return <div>{context.get(mainComponentPath, <></>)}</div>
}