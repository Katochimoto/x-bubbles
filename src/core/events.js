/**
 * @module x-bubbles/event
 */

const context = require('../context');
const CustomEventCommon = require('../polyfills/CustomEventCommon');

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
    const events = callback ? { [ eventName ]: callback } : eventName;
    for (const name in events) {
        target.addEventListener(name, oneCallback(target, name, events[ name ]));
    }
};

exports.on = function (target, eventName, callback) {
    const events = callback ? { [ eventName ]: callback } : eventName;
    for (const name in events) {
        target.addEventListener(name, events[ name ]);
    }
};

exports.off = function (target, eventName, callback) {
    const events = callback ? { [ eventName ]: callback } : eventName;
    for (const name in events) {
        target.removeEventListener(name, events[ name ]);
    }
};

exports.prevent = function (event) {
    event.cancelBubble = true;
    event.returnValue = false;
    event.stopImmediatePropagation();
    event.stopPropagation();
    event.preventDefault();
    return false;
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

function oneCallback(target, eventName, callback) {
    return function _callback(event) {
        target.removeEventListener(eventName, _callback);
        callback(event);
    };
}
