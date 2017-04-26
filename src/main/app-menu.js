import { app, Menu, autoUpdater } from 'electron'

import createWindow from './windows'

export default function createAppMenu(windows) {
  const menuTemplate = [
    {
      label: 'File',
      submenu: [
        {
          label: 'New Window',
          accelerator: 'CommandOrControl+N',
          click: () => createWindow(windows, windows.length),
        },
      ],
    },
    { label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'pasteandmatchstyle' },
        { role: 'delete' },
        { role: 'selectall' },
      ],
    },
    { role: 'window', submenu: [{ role: 'minimize' }, { role: 'close' }] },
    {
      label: 'Updates',
      submenu: [
        { label: `Version ${app.getVersion()}`, enabled: false },
        { label: 'Checking for Update', enabled: false, key: 'checkingForUpdate' },
        { label: 'Check for Update', visible: false, key: 'checkForUpdate', click: () => autoUpdater.checkForUpdates() },
        { label: 'Restart and Install Update', visible: false, key: 'restartToUpdate', click: () => autoUpdater.quitAndInstall() },
      ],
    },
  ]

  // Modify menu for Mac OS
  if (process.platform === 'darwin') {
    menuTemplate.unshift({
      label: app.getName(),
      submenu: [
        { role: 'about' },
        { type: 'separator' },
        { role: 'services', submenu: [] },
        { type: 'separator' },
        { role: 'hide' },
        { role: 'hideothers' },
        { role: 'unhide' },
        { type: 'separator' },
        { role: 'quit' },
      ],
    })
    // Window menu
    menuTemplate.find(menuItem => menuItem.role === 'window').submenu = [
      { role: 'close' },
      { role: 'minimize' },
      { role: 'zoom' },
      { type: 'separator' },
      { role: 'front' },
    ]
  }

  if (process.env.NODE_ENV === 'development') {
    menuTemplate.push({
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'toggledevtools' },
        { type: 'separator' },
        { role: 'resetzoom' },
        { role: 'zoomin' },
        { role: 'zoomout' },
        { type: 'separator' },
        { role: 'togglefullscreen' },
      ],
    })
  }

  return Menu.buildFromTemplate(menuTemplate)
}
