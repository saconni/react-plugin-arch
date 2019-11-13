import React from 'react'
import { useGlobalContext, usePlugin } from '../core/GlobalContext'
import { DialogTitle, DialogContent, DialogContentText, DialogActions, DialogButton } from './ModalDialog'

export default function ActivateTerminalPlugin(props) {
  let context = useGlobalContext()
  
  usePlugin(async modal => {
    // show welcome dialog
    await modal.doModalDialog(resolve => createWelcomeDialog(resolve))
    // activate plugin
    context.activatePlugin('activate-terminal')
  }, ['modal-dialog'])

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