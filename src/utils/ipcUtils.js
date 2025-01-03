let ipcRenderer = null;

if (typeof window !== "undefined" && window.require) {
  try {
    ipcRenderer = window.require("electron").ipcRenderer;
  } catch (e) {
    console.warn("Electron IPC Renderer not available.");
  }
}

export const invokeIpc = (channel, ...args) => {
  if (ipcRenderer) {
    return ipcRenderer.invoke(channel, ...args);
  } else {
    console.log(`Web fallback for channel: "${channel}"`);
    return Promise.resolve(null);
  }
};
