import React, { useState, Suspense } from 'react';
import { GlobalContextProvider, usePlugin } from './core/GlobalContext'
import { useInit } from './core/utils'

import availablePlugins from './plugins'

function Test(props) {

  usePlugin(null, ['modal-dialog', 'unlock-terminal'])

  return <></>
}

function App() {
  let [plugins, setPlugins] = useState({})

  useInit(() => {
    Object.keys(availablePlugins).reduce((prev, current) => {
      return prev.then((pending) => {
        return new Promise((resolve, reject) => {
          resolve({...pending, [current]: React.lazy(availablePlugins[current])})
          // the below code imports the plugin with out React.lazy
          /*
          availablePlugins[current]().then(plugin => {
            console.log(current)
            resolve({...pending, [current]: plugin.default})
          })
          */
        })
      })
    }, Promise.resolve()).then(pending => {
      setPlugins(pending)
    })
  })

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <GlobalContextProvider>
        {Object.keys(plugins).map(key => {
          let ElementType = plugins[key]
          return <ElementType key={key} />
        })}
        <Test />
      </GlobalContextProvider>
    </Suspense>
  )

}

export default App;
