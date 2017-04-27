import { app, Menu } from 'electron'
import { autoUpdater } from 'electron-updater'

import createWindow from './windows'
import config from './config'

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
    {
      label: 'Edit',
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
    {
      label: 'Theme',
      submenu: [
        { label: 'default', type: 'radio' },
        { label: 'dark', type: 'radio' },
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

  const currentTheme = config.get('crTheme')
  const menu = Menu.buildFromTemplate(menuTemplate)
  const themeSubmenuItems = menu.items.find(menuItem => menuItem.label === 'Theme').submenu.items
  themeSubmenuItems.find(subMenuItem => subMenuItem.label === currentTheme).checked = true

  // Add click events for theme submenu
  themeSubmenuItems.forEach(subMenuItem => {
    subMenuItem.click = () => {
      windows.forEach(win => win.webContents.send('themeChanges', subMenuItem.label))
      subMenuItem.checked = true
      config.set('crTheme', subMenuItem.label)
    }
  })

  return menu
}
