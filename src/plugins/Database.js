import React from 'react'
import Dexie from 'dexie';
import { useGlobalContext } from '../core/GlobalContext'
import { useExtension } from '../core/ExtensionManager'

let db = new Dexie('gvr-passport-web-db')
db.version(1).stores({
  keyValuePairs: ``,
  priceBookItems: `plu`,
  priceBookScanCodes: `code`,
  operators: `id`
})

export default function ActivateTerminalPlugin(props) {
  let context = useGlobalContext()
  
  useExtension(() => {
    // activate plugin
    context.activatePlugin('database', db)
  })

  return <></>
}