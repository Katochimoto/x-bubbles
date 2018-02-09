/**
 * @module x-bubbles/events
 */

const context = require('../context');
const CustomEventCommon = require('../polyfills/CustomEventCommon');
const { PROPS } = require('./constant');

exports.scrollX = scrollX;
exports.scrollY = scrollY;
exports.dispatch = dispatch;

exports.keyCode = function (event) {
    return event.charCode || event.keyCode;
};

exports.metaKey = function (event) {
    return event.ctrlKey || event.metaKey;
};

exports.pageX = function (event) {
    return (event.pageX === null && event.clientX !== null) ?
        event.clientX + scrollX() :
        event.pageX;
};

exports.pageY = function (event) {
    return (event.pageY === null && event.clientY !== null) ?
        event.clientY + scrollY() :
        event.pageY;
};

exports.one = function (target, eventName, callback) {
    toggleEvent(target, eventName, callback, true, false, true);
};

exports.on = function (target, eventName, callback) {
    toggleEvent(target, eventName, callback);
};

exports.off = function (target, eventName, callback) {
    toggleEvent(target, eventName, callback, false);
};

exports.oneLocal = function (target, eventName, callback) {
    toggleEvent(target, eventName, callback, true, true, true);
};

exports.onLocal = function (target, eventName, callback) {
    toggleEvent(target, eventName, callback, true, true);
};

exports.offLocal = function (target, eventName, callback) {
    toggleEvent(target, eventName, callback, false, true);
};

exports.prevent = function (event) {
    event.cancelBubble = true;
    event.returnValue = false;
    event.stopImmediatePropagation();
    event.stopPropagation();
    event.preventDefault();
    return false;
};

exports.proxyLocal = function (event) {
    dispatchLocalEvent(event.currentTarget, event);
};

function scrollX() {
    const html = context.document.documentElement;
    const body = context.document.body;
    return (html && html.scrollLeft || body && body.scrollLeft || 0) - (html.clientLeft || 0);
}

function scrollY() {
    const html = context.document.documentElement;
    const body = context.document.body;
    return (html && html.scrollTop || body && body.scrollTop || 0) - (html.clientTop || 0);
}

/**
 * Designer events.
 *
 * @example
 * const { Custom } = require('event');
 *
 * new Custom('custom-event', {
 *     bubbles: true,
 *     cancelable: true,
 *     detail: { data: '123' }
 * })
 *
 * @alias module:x-bubbles/event~Custom
 * @constructor
 */
const Custom = (function () {
    if (typeof context.CustomEvent === 'function') {
        return context.CustomEvent;
    }

    return CustomEventCommon;
}());

/**
 * Dispatch event.
 *
 * @example
 * const { dispatch } = require('event');
 * dispatch(node, 'custom-event', {
 *     bubbles: true,
 *     cancelable: true,
 *     detail: { data: '123' }
 * })
 *
 * @alias module:x-bubbles/event.dispatch
 * @param {HTMLElement} element node events
 * @param {string} name event name
 * @param {Object} params the event parameters
 * @param {boolean} [params.bubbles=false]
 * @param {boolean} [params.cancelable=false]
 * @param {*} [params.detail]
 */
function dispatch(element, name, params = {}) {
    element.dispatchEvent(new Custom(name, params));
}

function dispatchLocalEvent(element, event) {
    const callbacks = element[ PROPS.LOCAL_EVENTS ] && element[ PROPS.LOCAL_EVENTS ][ event.type ] || [];
    const sharedData = {};

    for (let i = 0; i < callbacks.length; i++) {
        if (event.immediatePropagationStopped) {
            break;
        }

        callbacks[ i ](event, sharedData);
    }
}

function oneCallback(element, eventName, callback) {
    return function _callback(event) {
        element.removeEventListener(eventName, _callback);
        callback(event);
    };
}

function getEventHandlersQueue(element, eventName) {
    if (!element[ PROPS.LOCAL_EVENTS ]) {
        element[ PROPS.LOCAL_EVENTS ] = {};
    }

    if (!element[ PROPS.LOCAL_EVENTS ][ eventName ]) {
        element[ PROPS.LOCAL_EVENTS ][ eventName ] = [];
    }

    return element[ PROPS.LOCAL_EVENTS ][ eventName ];
}

const EV_ACTIONS = {
    addLocalEventListener: function (element, eventName, callback) {
        getEventHandlersQueue(element, eventName).push(callback);
    },

    removeLocalEventListener: function (element, eventName, callback) {
        const callbacks = element[ PROPS.LOCAL_EVENTS ] && element[ PROPS.LOCAL_EVENTS ][ eventName ] || [];
        let i = 0;

        while (i < callbacks.length) {
            if (callbacks[ i ] === callback) {
                callbacks.splice(i, 1);

            } else {
                i++;
            }
        }
    },

    addEventListener: function (element, eventName, callback) {
        element.addEventListener(eventName, callback);
    },

    removeEventListener: function (element, eventName, callback) {
        element.removeEventListener(eventName, callback);
    },
};

function toggleEvent(element, eventName, userCallback, isSet = true, isLocal = false, isOne = false) {
    const events = userCallback ? { [ eventName ]: userCallback } : eventName;
    const action = `${isSet ? 'add' : 'remove'}${isLocal ? 'Local' : ''}EventListener`;

    for (const name in events) {
        const callback = isOne ? oneCallback(element, name, events[ name ]) : events[ name ];
        EV_ACTIONS[ action ](element, name, callback);
    }
}
