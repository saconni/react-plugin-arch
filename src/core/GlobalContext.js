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
    case 'EXTEND_CONTEXT':
      return immutable.set(state, ['core', 'context-extensions', action.name], action.code)
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
      extend: (name, code) => {
        dispatch({ type: 'EXTEND_CONTEXT', name, code })
      },
      activatePlugin: (name, obj) => {
        dispatch({type: 'ACTIVATE_EXTENSION', name, functions: obj})
      },
      deactivatePlugin: (name) => {
        dispatch({type: 'DEACTIVATE_EXTENSION', name})
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