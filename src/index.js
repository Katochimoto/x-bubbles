const context = require('./context');
const drag = require('./core/drag');
const editor = require('./core/editor');
const bubble = require('./core/bubble');
const bubbleset = require('./core/bubbleset');

const OPTIONS = {
    begining:           [ 'noop', null ],
    bubbleCopy:         [ 'funk', bubbleCopyOption ],
    bubbleDeformation:  [ 'funk', function () {} ],
    bubbleFormation:    [ 'funk', function () {} ],
    checkBubblePaste:   [ 'funk', checkBubblePasteOption ],
    classBubble:        [ 'noop', 'bubble' ],
    disableControls:    [ 'bool', false ],
    draggable:          [ 'bool', true ],
    ending:             [ 'noop', null ], // /\@ya\.ru/g;
    separator:          [ 'noop', /[,;]/ ],
};

const XBubbles = Object.create(HTMLDivElement.prototype, {
    createdCallback: {
        value: function () {
            initEditor(this);
        }
    },

    attachedCallback: {
        value: function () {
            initEditor(this);
            drag.init(this);
            bubble.bubbling(this);
        }
    },

    detachedCallback: {
        value: function () {
            drag.destroy(this);
            destroyEditor(this);
        }
    },

    /*
    attributeChangedCallback: {
        value: function (name, prevValue, value) {}
    },
    */

    options: {
        value: function (name, value) {
            if (!this._options) {
                this._options = {
                    ...Object.keys(OPTIONS).reduce(function (result, item) {
                        result[ item ] = undefined;
                        return result;
                    }, {}),

                    ...this.dataset
                };

                optionsPrepare(this._options);
            }

            if (typeof value !== 'undefined') {
                this._options[ name ] = value;
                optionsPrepare(this._options);

            } else {
                return this._options[ name ];
            }
        }
    },

    items: {
        get: function () {
            return bubbleset.getBubbles(this);
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
    }
});

module.exports = context.document.registerElement('x-bubbles', {
    extends: 'div',
    prototype: XBubbles
});

const OPTIONS_PREPARE = {
    funk: function (value) {
        const type = typeof value;
        switch (type) {
        case 'string':
            return new Function('context', `return context.${value};`)(context);

        case 'function':
            return value;
        }
    },
    bool: function (value) {
        const type = typeof value;
        switch (type) {
        case 'string':
            return (value === 'true' || value === 'on');

        case 'boolean':
            return value;
        }
    },
    noop: function (value) {
        return value;
    },
};

function optionsPrepare(options) {
    for (let name in OPTIONS) {
        const [ type, def ] = OPTIONS[ name ];
        options[ name ] = OPTIONS_PREPARE[ type ](options[ name ]);
        if (typeof options[ name ] === 'undefined') {
            options[ name ] = def;
        }
    }
}

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

function bubbleCopyOption(list) {
    return list.map(item => item.innerHTML).join(', ');
}

function checkBubblePasteOption() {
    return true;
}
