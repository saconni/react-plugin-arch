import React, { useContext, useReducer, useMemo } from 'react'

let immutable = require('object-path-immutable')
let objectPath = require('object-path')
let log = require('bows')('global-context')

function defaultReducer(state, action) {
  switch(action.type) {
    case 'REGISTER_REDUCER':
      return immutable.push(state, 'core.reducers', action.reducer)
    case 'UNREGISTER_REDUCER':
      return immutable.set(state, 'core.reducers', state.core.reducers.filter(r => r !== action.reducer))
    case 'ADD_CONTEXT_METHOD':
      return immutable.set(state, ['core', 'context-methods', action.name], action.code)
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

class ContextFunctions {
  constructor(state, dispatch) {
    this.state = state
    this.dispatch = dispatch
  }

  get(path, _default) {
    let val = objectPath.get(this.state, path, _default)
    if(val === undefined) {
      // maybe we could dispatch an error
      throw new Error(`context value not found ${path}`)
    }
    return val
  }

  addMethod(name, code) {
    this.dispatch({ type: 'ADD_CONTEXT_METHOD', name, code })
  }

  registerReducer (reducer) {
    this.dispatch({type: 'REGISTER_REDUCER', reducer})
  }

  unregisterReducer(reducer) {
    this.dispatch({type: 'UNREGISTER_REDUCER', reducer})
  }
}

export function GlobalContextProvider(props) {
  let [state, dispatch] = useReducer(rootReducer, initialState)

  let value = useMemo(() => {
    let v = new ContextFunctions(state, dispatch)
    let extraMethods = v.get(['core', 'context-methods'], {})
    Object.keys(extraMethods).forEach(key => {
      v[key] = extraMethods[key].bind(v)
    })
    return v
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