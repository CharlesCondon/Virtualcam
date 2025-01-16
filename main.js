const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const url = require("url");
const { spawn } = require("child_process");

let visibleWin;
let offscreenWin;
let pythonProcess;

function createWindows() {
    // Create the visible window
    visibleWin = new BrowserWindow({
        width: 1280,
        height: 980,
        webPreferences: {
            contextIsolation: false,
            nodeIntegration: true,
            backgroundThrottling: false,
        },
    });

    visibleWin.loadURL(
        url.format({
            pathname: path.join(__dirname, "index.html"),
            protocol: "file",
            slashes: true,
        })
    );

    visibleWin.webContents.openDevTools();

    // Create the offscreen window
    offscreenWin = new BrowserWindow({
        width: 1280,
        height: 720,
        show: false, // Keep the window hidden
        webPreferences: {
            offscreen: true,
            contextIsolation: false,
            nodeIntegration: true,
            backgroundThrottling: false,
        },
    });

    offscreenWin.loadURL(
        url.format({
            pathname: path.join(__dirname, "index.html"),
            protocol: "file",
            slashes: true,
            search: "?offscreen=true"
        })
    );

    // Start the Python virtual camera script
    pythonProcess = spawn("python", [path.join(__dirname, "virtual_cam.py")]);

    pythonProcess.stdout.on("data", (data) => {
        console.log(`Python Output: ${data}`);
    });

    pythonProcess.stderr.on("data", (data) => {
        console.error(`Python Error: ${data}`);
    });

    pythonProcess.on("exit", (code) => {
        console.log(`Python process exited with code ${code}`);
    });

    // Handle offscreen window rendering
    offscreenWin.webContents.on("paint", (event, dirty, image) => {
        try {
            const buffer = image.toBitmap();
            pythonProcess.stdin.write(buffer, (err) => {
                if (err) console.error("Error writing to Python stdin:", err);
            });

        } catch (err) {
            console.error("Error writing to Python process:", err);
        }
    });

    offscreenWin.webContents.setFrameRate(30); // Match the frame rate of the virtual camera

    visibleWin.on("closed", () => {
        visibleWin = null;
        if (offscreenWin) offscreenWin.close();

        // Kill the Python process gracefully
        if (pythonProcess) {
            pythonProcess.stdin.end(); // Close the stdin stream
            pythonProcess.kill();
        }
    });

    offscreenWin.on("closed", () => {
        offscreenWin = null;
    });

    ipcMain.on("sketch-update", (event, sketchIndex) => {
        console.log(`[Main] Received sketch-update event with index: ${sketchIndex}`);
    
       // Only send to offscreen window since visible window already updated
        if (offscreenWin && offscreenWin.webContents) {
            try {
                offscreenWin.webContents.send("update-sketch", sketchIndex);
                offscreenWin.webContents.invalidate();
                console.log(`[Main] Sent update-sketch to offscreen window`);
            } catch (err) {
                console.error('[Main] Error sending to offscreen window:', err);
            }
        }
        
        // Send to visible window
        if (visibleWin) {
            visibleWin.webContents.send("update-sketch", sketchIndex);
            console.log(`[Main] Sent update-sketch to visible window`);
        }
    });

    ipcMain.on("slider-update", (event, sliderData) => {
        console.log(`[Main] Received slider-update event:`, sliderData);

        // Send to offscreen window
        if (offscreenWin && offscreenWin.webContents) {
            try {
                offscreenWin.webContents.send("update-slider", sliderData);
                offscreenWin.webContents.invalidate();
                console.log(`[Main] Sent slider update to offscreen window`);
            } catch (err) {
                console.error('[Main] Error sending slider update to offscreen window:', err);
            }
        }
    });

}

app.on("ready", createWindows);

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("activate", () => {
    if (visibleWin === null) {
        createWindows();
    }
});
