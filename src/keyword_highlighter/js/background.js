import { loadSettingsFromStorage } from "./storage_service.js";
let settings = null;

const contentScriptMessageHandler = async function (data) {
    settings = await loadSettingsFromStorage();
    console.debug("background.js - data: " + JSON.stringify(data));
    if (data.message === "getSettings") return Promise.resolve(settings);
    else return Promise.reject("Unsupported message: " + data.message);
};

// TODO: implement onChange listener for local storage values and only reload settings on demand

browser.runtime.onMessage.addListener(contentScriptMessageHandler);
