import { conditionalDebugLog } from "./utils.js";

/**
 * @returns the settings stored in browser's storage.local
 */
const loadSettingsFromStorage = async () => {
    return browser.storage.local.get().then(
        (val) => {
            conditionalDebugLog(
                "loadSettingsFromStorage - Settings Loaded:" +
                    JSON.stringify(val)
            );
            return val;
        },
        (e) => console.error(e)
    );
};

/**
 * Saves the given settings object to browser's storage.local
 * @param {Object} settings the entire settings object
 */
const saveSettingsToStorage = async (settings) => {
    await browser.storage.local.set(settings).then(
        () => {
            conditionalDebugLog(
                "saveSettingsToStorage - Settings saved to storage.local!" +
                    JSON.stringify(settings)
            );
        },
        (e) => console.error(e)
    );
};

export { loadSettingsFromStorage, saveSettingsToStorage };
