// main.js

console.log("Starting...");

const {
  app,
  BrowserWindow,
  ipcMain,
  Notification,
  nativeTheme,
} = require("electron");
const path = require("node:path");

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 1240,
    height: 700,
    minWidth: 1208,
    minHeight: 640,
    frame: false,
    icon: path.join(__dirname, './public/favicon.ico'),  // Percorso all'icona
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      enableRemoteModule: false, // Assicurati che remote non sia usato
    },
  });

  mainWindow.loadFile("index.html");

  ipcMain.on("minimize-window", () => {
    mainWindow.minimize();
  });

  ipcMain.on("toggle-maximize-window", () => {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize();
    } else {
      mainWindow.maximize();
    }
  });

  ipcMain.on("close-window", () => {
    mainWindow.close();
  });

  ipcMain.handle("dark-mode:system", () => {
    nativeTheme.themeSource = "system";
  });
};

app.whenReady().then(() => {
  createWindow();
  new Notification({
    icon: "./public/favicon.ico",
    title: "Pong",
    body: "Pong game is ready",
  }).show();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
