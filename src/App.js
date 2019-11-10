import React from 'react';
import { GlobalContextProvider, usePlugin } from './core/GlobalContext'
import { ModalDialogPlugin } from './plugins/ModalDialog'
import { UnlockTerminal } from './plugins/UnlockTerminal'
import { ActivateTerminalPlugin } from './plugins/ActivateTerminal'

function Test(props) {

  usePlugin(null, ['modal-dialog', 'unlock-terminal'])

  return <></>
}

function App() {
  return (
    <GlobalContextProvider>
      <ActivateTerminalPlugin />
      <ModalDialogPlugin />
      <Test />
      <UnlockTerminal />
    </GlobalContextProvider>
  )
}

export default App;
