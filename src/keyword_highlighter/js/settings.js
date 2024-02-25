import {
    loadSettingsFromStorage,
    saveSettingsToStorage,
} from "./storage_service.js";

/* BEGIN Settings Panel*/
const textareaMaxLength = 8192;

/**
 * static DOM element IDs
 */
const id_loadButton = "loadSettings";
const id_saveButton = "saveSettings";
const id_executeButton = "executeHighlighter";

/**
 * // TODO: clean up these values once more dynamic functionality is implemented
 * Variable names as strings to make them reusable when saving / loading settings.
 * Also used as IDs and names in the respective HTML DOM elements.
 */
const var_positiveTerms = "positiveTerms";
const var_negativeTerms = "negativeTerms";

const isStringArray = [var_positiveTerms, var_negativeTerms];

/**
 * // TODO clean up this mess by adding more dynamic functionality further down
 * The actual user specified settings values that are loaded from local storage or changed via the settings panel.
 */
let settings = {};
settings[var_positiveTerms] = [];
settings[var_negativeTerms] = [];

/**
 * Loads the settings into the DOM elements.
 * Can handle the following HTML elements:
 *  - select
 *  - input with type text
 *  - input with type checkbox
 *  - textarea
 */
const loadSettingsIntoDOM = function (_settings) {
    for (var key of Object.keys(_settings)) {
        var domElem = document.getElementById(key);
        if (!domElem || domElem === new Object()) {
            console.warn(
                `loadSettingsIntoDOM - Couldn't find a respective DOM element corresponding to key ${key}`
            );
            continue;
        }
        try {
            // special treatment needed for checkboxes, since their "value" attribute doesn't do the proper thing
            if (domElem.nodeName === "INPUT" && domElem.type === "checkbox") {
                domElem.checked = _settings[key];
                continue;
            }
            // for text input, selects and textareas the value attribute works just fine
            domElem.value = _settings[key];
        } catch (e) {
            // in case of unsupported DOM element types and other unspecified errors
            console.debug(
                `loadSettingsIntoDOM - trying to get DOM element corresponding to key: ${key} and got DOM element: ${JSON.stringify(
                    domElem
                )}`
            );
        }
    }
    console.debug(
        "loadSettingsIntoDOM - Filled settings into DOM: " +
            JSON.stringify(_settings)
    );
};

/**
 * Saves the settings to local storage using browser.storage.local.set().
 * Can handle the following HTML elements:
 *  - select
 *  - input with type text
 *  - input with type checkbox
 *  - textarea
 */
const applySettings = async () => {
    if (!settings) {
        console.debug("applySettings - settings doesn't exist!");
        return;
    }
    for (var key of Object.keys(settings)) {
        var domElem = document.querySelector(`#${key}`);
        if (!domElem || domElem === new Object()) {
            console.warn(
                `applySettings - Couldn't find a respective DOM element corresponding to key ${key} - didn't save value for this key.`
            );
            continue;
        }
        try {
            // special treatment needed for checkboxes, since their "value" attribute doesn't do the proper thing
            if (domElem.nodeName === "INPUT" && domElem.type === "checkbox") {
                settings[key] = domElem.checked;
                continue;
            }
            // for text input, selects and textareas the value attribute works just fine
            // strings that represent arrays need to be split as such
            if (isStringArray.indexOf(key) >= 0) {
                settings[key] = domElem.value.split(",").map((x) => x.trim());
                continue;
            }
            settings[key] = domElem.value;
        } catch (e) {
            // in case of unsupported DOM element types and other unspecified errors
            console.debug(e);
        }
    }
    await browser.storage.local.set(settings).then(
        () => console.log("Settings saved!"),
        (e) => console.error(e)
    );
};

/**
 * Executes the content script to highlight keywords on demand.
 */
const executeScript = async function () {
    console.debug("executeScript - test");
    try {
        console.debug("executeScript - test 2");
        var activeTabs = await browser.tabs.query({
            active: true,
            currentWindow: true,
        });
        console.debug("active tabs: " + activeTabs.length);
        if (activeTabs.length > 1) {
            for (var theTab of activeTabs) {
                console.debug(JSON.stringify(theTab));
            }
        }

        if (activeTabs.length !== 1) {
            console.debug(
                "Not exactly one active tab found! Number of active tabs: " +
                    activeTabs.length
            );
            return;
        }

        browser.scripting.executeScript({
            target: {
                tabId: activeTabs[0].id,
                allFrames: false,
            },
            files: ["../js/keyword_highlighter_content.js"],
        });
    } catch (err) {
        console.error(`failed to execute script: ${err}`);
    }
    console.debug("added content script to page");
};

const loadButtonHandler = async function () {
    settings = await loadSettingsFromStorage();
    loadSettingsIntoDOM(settings);
};

const saveButtonHandler = async function () {
    await applySettings();
    saveSettingsToStorage(settings);
};

document
    .getElementById(id_saveButton)
    .addEventListener("click", saveButtonHandler);
document
    .getElementById(id_loadButton)
    .addEventListener("click", loadButtonHandler);
document
    .getElementById(id_executeButton)
    .addEventListener("click", executeScript);


loadButtonHandler()   
console.debug("settings.js has been executed");
