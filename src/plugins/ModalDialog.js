import React from 'react'
import { useGlobalContext, usePlugin } from '../core/GlobalContext'
import { ModalDialog } from './ModalDialog/ModalDialogWeb'

export { DialogTitle, DialogContent, DialogContentText, DialogActions, DialogButton } from './ModalDialog/ModalDialogWeb'

let immutable = require('object-path-immutable')
let objectPath = require('object-path')

function reducer(state, action) {
  switch(action.type) {
    case 'SHOW_MODAL_DIALOG':
      let ret = immutable.set(state, 'storage.modal-dialog.open', true)
      objectPath.set(ret, 'storage.modal-dialog.content', action.content)
      return ret
    case 'HIDE_MODAL_DIALOG':
      return immutable.set(state, 'storage.modal-dialog.open', false)
    default:
      return state
  }
}

class ModalDialogFunctions {
  constructor(context) {
    this.context = context
  }

  showDialog(content) {
    this.context.dispatch({ type: 'SHOW_MODAL_DIALOG', content })
  }

  hideDialog() {
    this.context.dispatch({ type: 'HIDE_MODAL_DIALOG' })
  }

  doModalDialog(contentFactory) {
    return new Promise((resolve, reject) => {
      let complete = reason => {
        this.hideDialog()
        resolve(reason)
      }
      this.showDialog(contentFactory(complete))
    })
  }
}

export default function ModalDialogPlugin(props) {
  let context = useGlobalContext()

  usePlugin(() => {
    context.registerReducer(reducer)
    context.activatePlugin('modal-dialog', new ModalDialogFunctions(context))
    
    return () => {
      context.unregisterReducer(reducer)
      context.deactivatePlugin('modal-dialog')
    }
  })

  let active = context.pluginIsActive('modal-dialog')
  let {open, content} = context.get('storage.modal-dialog', {open: false})
  
  return active && <ModalDialog open={open}>{content || <></>}</ModalDialog>
}