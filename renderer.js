// renderer.js

// Funzioni per controllare la finestra
function minimize() {
  window.api.minimizeWindow();
}

function maximize() {
  window.api.maximizeWindow();
}

function closeWindow() {
  window.api.closeWindow();
}

// Aggiungi gli event listeners ai pulsanti
document.getElementById("minimize-button").addEventListener("click", minimize);
document.getElementById("maximize-button").addEventListener("click", maximize);
document.getElementById("close-button").addEventListener("click", closeWindow);
