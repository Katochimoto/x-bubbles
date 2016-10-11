const context = require('../context');

/**
 * @constant {Document}
 * @private
 */
const doc = context.document;

/**
 * @constant {Object}
 * @private
 */
const protoEvent = context.Event.prototype;

let issetCustomEvent = false;

try {
    issetCustomEvent = Boolean(doc.createEvent('CustomEvent'));
} catch (e) {
    // do nothing
}

/**
 * The original function "stopImmediatePropagation"
 * @constant {function}
 * @private
 */
const stopImmediatePropagation = protoEvent.stopImmediatePropagation;

/**
 * Override function to set properties "immediatePropagationStopped"
 */
protoEvent.stopImmediatePropagation = function () {
    this.immediatePropagationStopped = true;

    if (stopImmediatePropagation) {
        stopImmediatePropagation.call(this);

    } else {
        this.stopPropagation();
    }
};

let CustomEventCommon = (function () {
    if (issetCustomEvent) {
        return function (eventName, params) {
            params = params || {};

            let bubbles = Boolean(params.bubbles);
            let cancelable = Boolean(params.cancelable);
            let evt = doc.createEvent('CustomEvent');

            evt.initCustomEvent(eventName, bubbles, cancelable, params.detail);

            return evt;
        };
    }

    return function (eventName, params) {
        params = params || {};

        let bubbles = Boolean(params.bubbles);
        let cancelable = Boolean(params.cancelable);
        let evt = doc.createEvent('Event');

        evt.initEvent(eventName, bubbles, cancelable);
        evt.detail = params.detail;

        return evt;
    };
}());

CustomEventCommon.prototype = protoEvent;

module.exports = CustomEventCommon;
