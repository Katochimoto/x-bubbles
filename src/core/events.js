/**
 * @module x-bubbles/event
 */

const raf = require('raf');
const context = require('../context');
const CustomEventCommon = require('../polyfills/CustomEventCommon');
const { EV } = require('./constant');
const text = require('./text');

exports.scrollX = scrollX;
exports.scrollY = scrollY;

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

exports.one = function (target, eventName, userCallback) {
    return target.addEventListener(eventName, function callback(event) {
        target.removeEventListener(eventName, callback);
        userCallback(event);
    });
};

exports.on = function (target, eventName, userCallback) {
    const events = userCallback ? { [ eventName ]: userCallback } : eventName;
    for (let name in events) {
        target.addEventListener(name, events[ name ]);
    }
};

exports.off = function (target, eventName, userCallback) {
    const events = userCallback ? { [ eventName ]: userCallback } : eventName;
    for (let name in events) {
        target.removeEventListener(name, events[ name ]);
    }
};

exports.prevent = function (event) {
    event.cancelBubble = true;
    event.returnValue = false;
    event.stopPropagation();
    event.preventDefault();
    return false;
};

exports.fireEdit = function (nodeBubble) {
    dispatch(this, EV.BUBBLE_EDIT, {
        bubbles: false,
        cancelable: false,
        detail: { data: nodeBubble }
    });
};

exports.fireChange = function () {
    dispatch(this, EV.CHANGE, {
        bubbles: false,
        cancelable: false
    });
};

exports.fireInput = function () {
    const textRange = text.currentTextRange();
    const editText = textRange && text.textClean(textRange.toString()) || '';

    if (this._bubbleValue !== editText) {
        this._bubbleValue = editText;

        dispatch(this, EV.BUBBLE_INPUT, {
            bubbles: false,
            cancelable: false,
            detail: { data: editText }
        });
    }
};

exports.throttle = function (callback) {
    let throttle = 0;
    const animationCallback = function () {
        throttle = 0;
    };

    return function () {
        if (throttle) {
            return;
        }

        throttle = raf(animationCallback);

        callback.apply(this, arguments);
    };
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
