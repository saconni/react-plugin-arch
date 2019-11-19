import React, { useState } from 'react'
import { useGlobalContext } from './GlobalContext'
import { useInit } from './utils'

import builtInExtensions from '../builtInExtensions'

let immutable = require('object-path-immutable')
let objectPath = require('object-path')

let log = require('bows')('extension-manager')

function reducerExtensionManager(state, action) {
  let installedExtensionsPath = ['core', 'installed-extensions', action.name]
  let activeExtensionsPath = ['core', 'active-extensions', action.name]
  switch(action.type) {
    case 'INSTALL_EXTENSION':
      if(objectPath.get(state, installedExtensionsPath, null)) {
        return immutable.push(state, 'errors', new Error(`duplicate extension name ${action.name}`))
      }
      return immutable.set(state, installedExtensionsPath, action.extension)
    case 'UNINSTALL_EXTENSION':
      return immutable.del(state, installedExtensionsPath)
    case 'ACTIVATE_EXTENSION':
      return immutable.set(state, activeExtensionsPath, action.functions)
    case 'DEACTIVATE_EXTENSION':
        return immutable.del(state, activeExtensionsPath)
    default:
      return state
  }
}

export default function ExtensionManager(props) {
  let context = useGlobalContext()
  let plugins = context.get('core.installed-extensions', {})
  let [ready, setReady] = useState(false)
  let bootExtensions = props.boot || []

  useInit(() => {
    context.registerReducer(reducerExtensionManager)

    context.addMethod('activatePlugin', (name, functions) => {
      context.dispatch( {type: 'ACTIVATE_EXTENSION', name, functions} )
    })

    loadExtensions(bootExtensions).then(extensions => {
      Object.keys(extensions).forEach(key => {
        context.dispatch({ type: 'INSTALL_EXTENSION', name: key, extension: extensions[key] })
      })
      setReady(true)
    })
  })

  return (ready && 
    <>
      {Object.keys(plugins).map(key => {
        let ExtensionType = plugins[key]
        return <ExtensionType key={key} />
      })}
      {props.children}
    </>
  )
}

export function useExtension(initializer, dependencies) {
  // store a finalizer
  let [finalizer, setFinalizer] = useState(null)
  let [initialized, setInitialized] = useState(false)
  // get the global context
  let context = useGlobalContext()

  let extensions = context.get('core.active-extensions', {})
  let args = (dependencies || []).map(d=>extensions[d])
  let ready = args.indexOf(undefined) === -1

  if(!initialized) {
    if(ready) {
      let ret = null
      setInitialized(true)
      if(typeof initializer === 'function') {
        log('calling plugin initializer', { fn: initializer })
        ret = initializer.apply(null, args) || (() => {})
      }
      if(ret && typeof ret.then === 'function') {
        ret.then(() => setFinalizer({finalize: ret}))
      } else {
        setFinalizer({finalize: ret})
      }
    }
  } else {
    if(!ready) {
      setInitialized(false)
      finalizer.finalize()
      setFinalizer(null)
    }
  }

  // register a finalizer just 
  // in case we are unmounted
  useInit(() => () => {
    if(finalizer) {
      finalizer.finalize()
    }
  })

  return args
}

export function createExtension(code, dependencies) {
  let ExtensionComponent = function(props) {
    let context = useGlobalContext()
    useExtension(code.bind(null, context), dependencies)
    return <></>
  }
  return ExtensionComponent
}

function loadExtensions(extensionDefs) {
  return extensionDefs.reduce((sum, current) => {
    return sum.then(extensions => {
      return loadExtension(current).then(ext => {
        return {...extensions, [current.name]: ext}
      })
    })
  }, Promise.resolve({}))
}

function loadExtension(extensionDef) {
  return new Promise((resolve, reject) => {
    if(extensionDef.type === 'built-in') {
      resolve(React.lazy(builtInExtensions[extensionDef.url]))
    } else {
      if(!window) throw new Error('running outside browser not supported')
      let extension = null
      window.installExtension = construct => {
        extension = construct(createExtension)
      }
      import(/* webpackIgnore: true */ extensionDef.url).then(() => {
        resolve(extension)
      })
    }
  })
}

export function extensionIsActive(context, extensionName) {
  return objectPath.get(context.state, ['core', 'active-extensions', extensionName], null) != null
}