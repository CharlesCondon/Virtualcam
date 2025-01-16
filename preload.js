// const { contextBridge, ipcRenderer } = require("electron");

// contextBridge.exposeInMainWorld("electronAPI", {
//     updateSketch: (sketchIndex) => {
//         console.log(`[Preload] Sending sketch-update event with index: ${sketchIndex}`);
//         ipcRenderer.send("sketch-update", sketchIndex);
//     }
// });

// ipcRenderer.on("update-sketch", (event, sketchIndex) => {
//     console.log(`[Preload] Received update-sketch event with index: ${sketchIndex}`);
//     window.dispatchEvent(
//         new CustomEvent("sketch-update", { detail: { sketchIndex } })
//     );
// });
