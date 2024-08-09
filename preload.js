// preload.js
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
  minimizeWindow: () => ipcRenderer.send("minimize-window"),
  maximizeWindow: () => ipcRenderer.send("toggle-maximize-window"),
  closeWindow: () => ipcRenderer.send("close-window"),
  // Se hai bisogno di altre API
});
