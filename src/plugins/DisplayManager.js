import React, { useEffect } from 'react'
import { useGlobalContext, usePlugin } from '../core/GlobalContext'

let immutable = require('object-path-immutable')

function displayManagerReducer(state, action) {
  switch(action.type) {
    case 'ACTIVATE_MAIN_COMPONENT': 
      return immutable.set(state, 'storage.display-manager.main-component', action.component)
    case 'DEACTIVATE_MAIN_COMPONENT':
      return immutable.del(state, 'storage.display-manager.main-component')
    default:
      return state
  }
}

function DisplayManager(props) {
  let context = useGlobalContext()

  usePlugin(() => {

  })

  return <div></div>
}