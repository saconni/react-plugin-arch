import React, { Suspense } from 'react';
import { GlobalContextProvider } from './core/GlobalContext'
import ExtensionManager, { useExtension } from './core/ExtensionManager'

function Test(props) {

  useExtension(null, ['modal-dialog', 'unlock-terminal'])

  return <></>
}

let bootExtensions = [
  {
    name: 'activate-terminal',
    type: 'built-in',
    url: 'ActivateTerminalPlugin'
  },
  {
    name: 'config',
    type: 'built-in',
    url: 'ConfigPlugin'
  },
  {
    name: 'database',
    type: 'built-in',
    url: 'DatabasePlugin'
  },
  {
    name: 'display-manager',
    type: 'built-in',
    url: 'DisplayManagerPlugin'
  },
  {
    name: 'modal-dialog',
    type: 'built-in',
    url: 'ModalDialogPlugin'
  }
]

function App() {

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <GlobalContextProvider>
        <ExtensionManager boot={bootExtensions}>
          <Test />
        </ExtensionManager>
      </GlobalContextProvider>
    </Suspense>
  )

}

export default App;
