function isString(value) {
    if (value === undefined || value === null) {
        return false;
    }
    return typeof value === 'string' || value instanceof String;
};

function isArray(value) {
    if (value === undefined || value === null) {
        return false;
    }
    return value instanceof Array;
};

/**
 * Returns whether the given element is contained into the given array.
 * @param element the element to check presence for
 * @param array the array to check for the element presence
 * @return the index of the element, if present, or a negative index if the element is not present
 */
function inArray(element, array) {
    for (var i = 0; i < array.length; ++i) {
        if (element === array[i]) {
            return i;
        }
    }
    return -1;
};

function cometd_setTimeout(cometd, funktion, delay) {
    return window.setTimeout(function() {
        try {
            cometd._debug('Invoking timed function', funktion);
            funktion();
        } catch (x) {
            cometd._debug('Exception invoking timed function', funktion, x);
        }
    }, delay);
};

function cometd_clearTimeout(timeoutHandle) {
    window.clearTimeout(timeoutHandle);
};

module.exports = {
    isString: isString,
    isArray: isArray,
    inArray: inArray,
    setTimeout: cometd_setTimeout,
    clearTimeout: cometd_clearTimeout
};
