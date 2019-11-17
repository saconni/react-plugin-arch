(function() {
  let installPlugin = window.installPlugin
  installPlugin(createPlugin => {
    return createPlugin((context, modal) => {
      context.activatePlugin('unlock-terminal')
      context.dispatch({ type: 'MOUNT_MAIN_COMPONENT', component: 'Hola Mundo!' })
      setTimeout(() => {
        context.dispatch({ type: 'UNMOUNT_MAIN_COMPONENT' })
      }, 10000)
    }, ['modal-dialog', 'activate-terminal', 'display-manager'])
  })
})()