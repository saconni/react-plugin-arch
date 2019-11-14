import React from 'react'
import Dexie from 'dexie';
import { useGlobalContext, usePlugin } from '../core/GlobalContext'

let db = new Dexie('gvr-passport-web-db')
db.version(1).stores({
  keyValuePairs: ``,
  priceBookItems: `plu`,
  priceBookScanCodes: `code`,
  operators: `id`
})

export default function ActivateTerminalPlugin(props) {
  let context = useGlobalContext()
  
  usePlugin(() => {
    // activate plugin
    context.activatePlugin('database', db)
  })

  return <></>
}