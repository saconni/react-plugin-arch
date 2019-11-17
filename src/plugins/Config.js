import React, { useEffect } from 'react'
import { useGlobalContext } from '../core/GlobalContext'
import { useExtension, extensionIsActive } from '../core/ExtensionManager'

let immutable = require('object-path-immutable')

let log = require('bows')('config-plugin')

function reducer(state, action) {
  switch(action.type) {
    case 'PUT_CONFIG': 
      return immutable.set(state, ['storage', 'config'], action.value)
    case 'PUT_CONFIG_VALUE':
      return immutable.set(state, ['storage', 'config', action.path], action.value)
    default:
      return state
  }
}

class ConfigFunctions {
  constructor(context) {
    this.context = context
  }
  putValue(path, value) {
    this.context.dispatch({type: 'PUT_CONFIG_VALUE', path, value})
  }
  getValue(path, _default) {
    return this.context.get(['storage.config', path], _default)
  }
}

export default function ConfigPlugin(props) {
  let context = useGlobalContext()

  // plugin init
  let [db] = useExtension(async db => {
    context.registerReducer(reducer)
    // restore from indexedDB
    let stored = await db.keyValuePairs.get('config', null)
    if(stored) {
      log('config restored', stored) 
      context.dispatch({type: 'PUT_CONFIG', value: stored})
    }
    // activate plugin
    context.activatePlugin('config', new ConfigFunctions(context))
  }, ['database'])

  let active = extensionIsActive(context, 'config')

  // persist every change on the config
  let config = context.get('storage.config', null)
  useEffect(() => {
    if(active) {
      log('persisting config', config)
      db.keyValuePairs.put(config, 'config')
    }
  }, [active, config, db])

  return <></>
}