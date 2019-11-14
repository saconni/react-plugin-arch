import React from 'react'

import { Dialog } from '@material-ui/core'

export { DialogTitle, DialogContent, DialogContentText, DialogActions, Button as DialogButton } from '@material-ui/core'

export function ModalDialog(props) {
  let { open, onDismiss, children } = props

  return (
    <Dialog
      open={open}
      onClose={onDismiss}
      fullWidth={true}
      maxWidth={'sm'}
    >
      {children}
    </Dialog>
  )
}