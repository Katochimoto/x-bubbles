/**
 * @module x-bubbles/event
 */

const context = require('../context');
const CustomEventCommon = require('../polyfills/CustomEventCommon');

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
function dispatch(element, name, params) {
    element.dispatchEvent(new Custom(name, params || {}));
}

/**
 * Forwarding events
 *
 * @example
 * const { forwardingEvents } = require('event');
 * forwardingEvents('custom-event', fromNode, toNode, false);
 *
 * @param {string} name event name
 * @param {HTMLElement} fromElement
 * @param {HTMLElement} toElement
 * @param {boolean} [capture=false]
 * @returns {function} callback
 */
function forwardingEvents(name, fromElement, toElement, capture = false) {
    const callback = function (event) {
        dispatch(toElement, name, {
            bubbles: event.bubbles,
            cancelable: event.cancelable,
            detail: event.detail
        });
    };

    callback.cancel = function () {
        fromElement.removeEventListener(name, callback, capture);
    };

    fromElement.addEventListener(name, callback, capture);

    return callback;
}

exports.Custom = Custom;
exports.dispatch = dispatch;
exports.forwardingEvents = forwardingEvents;
