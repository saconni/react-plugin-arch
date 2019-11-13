import React, { Suspense } from 'react';
import { GlobalContextProvider, usePlugin } from './core/GlobalContext'
import { ModalDialogPlugin } from './plugins/ModalDialog'
import { UnlockTerminal } from './plugins/UnlockTerminal'
//import ActivateTerminalPlugin from './plugins/ActivateTerminal'

let ActivateTerminalPlugin = React.lazy(() => import('./plugins/ActivateTerminal'))

function Test(props) {

  usePlugin(null, ['modal-dialog', 'unlock-terminal'])

  return <></>
}

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <GlobalContextProvider>
        <ActivateTerminalPlugin />
        <ModalDialogPlugin />
        <Test />
        <UnlockTerminal />
      </GlobalContextProvider>
    </Suspense>
  )

}

export default App;
