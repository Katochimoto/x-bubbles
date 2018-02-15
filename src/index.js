/**
 * XBubbles custom element.
 * @module x-bubbles
 */

const context = require('./context');
const editor = require('./core/editor');
const utils = require('./core/utils');
const options = require('./core/options');

/**
 * Prototype of XBubbles.
 * @type {Object}
 */
const XBubbles = Object.create(HTMLDivElement.prototype, {
    createdCallback: {
        value: function () {
            initEditor(this);
            utils.ready(this);
        }
    },

    attachedCallback: {
        value: function () {
            initEditor(this);
            this.editor.bubbling();
        }
    },

    detachedCallback: {
        value: function () {
            destroyEditor(this);
        }
    },

    attributeChangedCallback: {
        value: function (/* name, prevValue, value */) {
            options(this);
        }
    },

    /**
     * The receiving and recording settings.
     * @memberof XBubbles
     * @function
     * @param {string|object} name - string, if only one option is inserted, or object - if many options inserted
     * @param {*} value
     * @returns {*}
     * @public
     */
    options: {
        value: function (name, value) {
            return options(this, name, value);
        }
    },

    /**
     * List bablow.
     * @memberof XBubbles
     * @type {array}
     * @public
     */
    items: {
        get: function () {
            return this.editor.getItems();
        }
    },

    /**
     * The value entered.
     * @memberof XBubbles
     * @type {string}
     * @public
     */
    inputValue: {
        get: function () {
            return this.editor.inputValue();
        }
    },

    /**
     * Set contents of the set.
     * @function
     * @memberof XBubbles
     * @param {string} data
     * @returns {boolean}
     * @public
     */
    setContent: {
        value: function (data) {
            return this.editor.setContent(data);
        }
    },

    canAddBubble: {
        value: function () {
            return this.editor.canAddBubble();
        }
    },

    /**
     * Add bubble.
     * @function
     * @memberof XBubbles
     * @param {string} bubbleText
     * @param {Object} [data]
     * @returns {boolean}
     * @public
     */
    addBubble: {
        value: function (bubbleText, data) {
            return this.editor.addBubble(bubbleText, data);
        }
    },

    /**
     * Remove bubble.
     * @function
     * @memberof XBubbles
     * @param {HTMLElement} nodeBubble
     * @returns {boolean}
     * @public
     */
    removeBubble: {
        value: function (nodeBubble) {
            return this.editor.removeBubble(nodeBubble);
        }
    },

    /**
     * Edit bubble.
     * @function
     * @memberof XBubbles
     * @param {HTMLElement} nodeBubble
     * @returns {boolean}
     * @public
     */
    editBubble: {
        value: function (nodeBubble) {
            return this.editor.editBubble(nodeBubble);
        }
    },

    /**
     * Starting formation bablow.
     * @function
     * @memberof XBubbles
     * @returns {boolean}
     * @public
     */
    bubbling: {
        value: function () {
            return this.editor.bubbling();
        }
    },
});

module.exports = context.document.registerElement('x-bubbles', {
    extends: 'div',
    prototype: XBubbles
});

function initEditor(node) {
    if (!node.editor) {
        Object.defineProperty(node, 'editor', {
            configurable: true,
            value: editor.init(node)
        });
    }
}

function destroyEditor(node) {
    if (node.editor) {
        editor.destroy(node);
        delete node.editor;
    }
}
