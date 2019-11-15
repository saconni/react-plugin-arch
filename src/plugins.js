const plugins = {
  ActivateTerminalPlugin: () => import('./plugins/ActivateTerminal'),
  DatabasePlugin: () => import('./plugins/Database'),
  DisplayManagerPlugin: () => import('./plugins/DisplayManager'),
  ConfigPlugin: () => import('./plugins/Config'),
  ModalDialogPlugin: () => import('./plugins/ModalDialog'),
  UnlockTerminalPlugin: () => import('./plugins/UnlockTerminal'),
}

export default plugins