import React, { useContext, useReducer, useMemo, useState } from 'react'
import { useInit } from './utils'

let immutable = require('object-path-immutable')
let objectPath = require('object-path')
let log = require('bows')('global-context')

function defaultReducer(state, action) {
  switch(action.type) {
    case 'REGISTER_REDUCER':
      return immutable.push(state, 'core.reducers', action.reducer)
    case 'UNREGISTER_REDUCER':
      return immutable.set(state, 'core.reducers', state.core.reducers.filter(r => r !== action.reducer))
    case 'ACTIVATE_PLUGIN':
      if(state.plugins[action.name] !== undefined) {
        throw new Error('duplicated plugin')
      }
      return immutable.merge(state, 'plugins', { [action.name]: action.plugin || null })
    case 'DEACTIVATE_PLUGIN':
      if(objectPath.has(state, ['plugins', action.name])) {
        return immutable.del(state, ['plugins', action.name])
      } else {
        return state
      }
    default:
      return state
  }
}

let initialState = {
  core: {
    reducers: [defaultReducer]
  },
  plugins: {}
}

export function useGlobalContext() {
  return useContext(GlobalContext)
}

export function usePlugin(initializer, deps) {
  // store a finalizer
  let [finalizer, setFinalizer] = useState(null)
  let [initialized, setInitialized] = useState(false)
  // get the global context
  let context = useGlobalContext()

  let plugins = context.get('plugins')
  let args = (deps || []).map(d=>plugins[d])
  let ready = args.indexOf(undefined) === -1

  // no finalizer means we are not yet activated
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
      setInitialized(true)
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

function rootReducer(state, action) {
  let {type, ...others} = action
  log('processing action', type, others)
  let firstReducer = null
  let newState = state
  state.core.reducers.forEach(reducer => {
    let prevState = newState
    newState = reducer(newState, action)
    if(newState !== prevState) {
      if(firstReducer) {
        console.warn('action processed by more than one reducer')
      } else {
        firstReducer = reducer
      }
      log('action processed', {reducer, prevState, newState})
    }
  })
  return newState
}

export function GlobalContextProvider(props) {
  let [state, dispatch] = useReducer(rootReducer, initialState)

  let value = useMemo(() => {
    return {
      state,
      dispatch,
      get: (path, _default) => {
        let value = objectPath.get(state, path, _default)
        if(value === undefined) {
          throw new Error(`context value not found ${path}`)
        }
        return value
      },
      activatePlugin: (name, obj) => {
        dispatch({type: 'ACTIVATE_PLUGIN', name, plugin: obj})
      },
      deactivatePlugin: (name) => {
        dispatch({type: 'DEACTIVATE_PLUGIN', name})
      },
      pluginIsActive: (name) => {
        return objectPath.has(state, ['plugins', name])
      },
      registerReducer: (reducer) => {
        dispatch({type: 'REGISTER_REDUCER', reducer})
      },
      unregisterReducer: (reducer) => {
        dispatch({type: 'UNREGISTER_REDUCER', reducer})
      }
    }
  }, [state])

  return <GlobalContext.Provider value={value}>{props.children}</GlobalContext.Provider>
}

export let GlobalContext = React.createContext({
  dispatch: () => {
    throw new Error('no global context provided')
  },
  get: () => {
    throw new Error('no global context provided')
  }
})