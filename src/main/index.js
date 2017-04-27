import { app, Menu } from 'electron'
import { join } from 'path'
import flashLoader from 'flash-player-loader'

import createWindow from './windows'
import createAppMenu from './app-menu'
import initializeAutoUpdater from './auto-updater'
import config from './config'

if (process.env.NODE_ENV === 'development') require('electron-reload')(__dirname)

flashLoader.addSource(join(__dirname, '../../flash/PepperFlashPlayer.plugin')).load() // Load flash

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected
const windows = []

app.on('ready', () => {
  config.get('windowStates').forEach((state, index) => createWindow(windows, index, state))
  if (windows.length === 0) createWindow(windows, 0)
  Menu.setApplicationMenu(createAppMenu(windows)) // Attach menu
  if (process.env.NODE_ENV !== 'development') initializeAutoUpdater()
})

// Quit when all windows are closed
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open
  if (windows.length === 0) createWindow(windows, 0)
})

app.on('before-quit', () => {
  config.set('windowStates', windows.map(win => win.getBounds()))
})
