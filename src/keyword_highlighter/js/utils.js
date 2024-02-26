const isDebugLogEnabled = true;

const conditionalDebugLog = function (args) {
    if (!isDebugLogEnabled) return;

    console.debug(args);
};

export { conditionalDebugLog };
