/**
 * @module x-bubbles/event
 */

const raf = require('raf');
const context = require('../context');
const CustomEventCommon = require('../polyfills/CustomEventCommon');
const { EV } = require('./constant');
const text = require('./text');

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

exports.throttle = function (callback, ctx) {
    let throttle = 0;
    const animationCallback = function () {
        throttle = 0;
    };

    return function () {
        if (throttle) {
            return;
        }

        throttle = raf(animationCallback);

        callback.apply(ctx || this, arguments);
    };
};

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
