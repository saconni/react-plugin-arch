import React from 'react'
import { useGlobalContext  } from '../core/GlobalContext'
import { useExtension, extensionIsActive } from '../core/ExtensionManager'
import { ModalDialog } from './ModalDialog/ModalDialogWeb'

export { DialogTitle, DialogContent, DialogContentText, DialogActions, DialogButton } from './ModalDialog/ModalDialogWeb'

let immutable = require('object-path-immutable')

function reducer(state, action) {
  switch(action.type) {
    case 'SHOW_MODAL_DIALOG':
      return immutable.merge(state, 'storage.modal-dialog', {
        open: true,
        content: action.content
      })
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

  useExtension(() => {
    context.registerReducer(reducer)
    context.activatePlugin('modal-dialog', new ModalDialogFunctions(context))
    
    return () => {
      context.unregisterReducer(reducer)
      context.deactivatePlugin('modal-dialog')
    }
  })

  let active = extensionIsActive(context, 'modal-dialog')
  let {open, content} = context.get('storage.modal-dialog', {open: false})
  
  return active && <ModalDialog open={open}>{content || <></>}</ModalDialog>
}