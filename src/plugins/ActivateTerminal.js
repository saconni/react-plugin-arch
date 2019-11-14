import React from 'react'
import { useGlobalContext, usePlugin } from '../core/GlobalContext'
import { DialogTitle, DialogContent, DialogContentText, DialogActions, DialogButton } from './ModalDialog'

export default function ActivateTerminalPlugin(props) {
  let context = useGlobalContext()
  
  usePlugin(async (modal, config)=> {
    config.putValue('something', 'value')
    // show welcome dialog
    await modal.doModalDialog(resolve => createWelcomeDialog(resolve))
    config.putValue('something else', 'value')
    // activate plugin
    context.activatePlugin('activate-terminal')
  }, ['modal-dialog', 'config'])

  return <></>
}

function createWelcomeDialog(resolve) {
  return (
    <>
      <DialogTitle>Activate your Passort</DialogTitle>
      <DialogContent>
        <DialogContentText>
          This terminal is not yet activated. Click NEXT to start the activation process.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <DialogButton onClick={() => resolve('ok')}>NEXT</DialogButton>
      </DialogActions>
    </>
  )
}