const context = require('./context');
const editor = require('./core/editor');
const utils = require('./core/utils');
const options = require('./core/options');

const XBubbles = Object.create(HTMLDivElement.prototype, {
    createdCallback: {
        value: function () {
            initEditor(this);
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

    options: {
        value: function (name, value) {
            return options(this, name, value);
        }
    },

    items: {
        get: function () {
            return this.editor.getItems();
        }
    },

    inputValue: {
        get: function () {
            return this.editor.inputValue();
        }
    },

    setContent: {
        value: function (data) {
            return this.editor.setContent(data);
        }
    },

    addBubble: {
        value: function (bubbleText, data) {
            return this.editor.addBubble(bubbleText, data);
        }
    },

    removeBubble: {
        value: function (nodeBubble) {
            return this.editor.removeBubble(nodeBubble);
        }
    },

    editBubble: {
        value: function (nodeBubble) {
            return this.editor.editBubble(nodeBubble);
        }
    },

    bubbling: {
        value: function () {
            return this.editor.bubbling();
        }
    },

    ready: {
        value: function (callback) {
            utils.ready(callback, this);
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
