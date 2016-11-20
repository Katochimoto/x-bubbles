const context = require('./context');
const drag = require('./core/drag');
const editor = require('./core/editor');
const bubble = require('./core/bubble');
const bubbleset = require('./core/bubbleset');

const OPTIONS = {
    begining:           [ 'reg', null, 'begining' ],
    bubbleCopy:         [ 'func', bubbleCopyOption, 'bubble-copy' ],
    bubbleDeformation:  [ 'func', function () {}, 'bubble-deformation' ],
    bubbleFormation:    [ 'func', function () {}, 'bubble-formation' ],
    checkBubblePaste:   [ 'func', checkBubblePasteOption, 'check-bubble-paste' ],
    classBubble:        [ 'str', 'bubble', 'class-bubble' ],
    disableControls:    [ 'bool', false, 'disable-controls' ],
    draggable:          [ 'bool', true, 'draggable' ],
    ending:             [ 'reg', null, 'ending' ], // /\@ya\.ru/g;
    separator:          [ 'reg', /[,;]/, 'separator' ],
    tokenizer:          [ 'func', null, 'tokenizer' ],
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
                this._options = {};

                for (const optionName in OPTIONS) {
                    this._options[ optionName ] = undefined;

                    const attrName = `data-${OPTIONS[ optionName ][2]}`;
                    if (this.hasAttribute(attrName)) {
                        this._options[ optionName ] = this.getAttribute(attrName);
                    }
                }

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
    func: function (value) {
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
    reg: function (value) {
        const type = typeof value;
        switch (type) {
        case 'string':
            if (value) {
                const match = value.match(/\/(.+)\/([gimy]{0,3})/i);
                if (match) {
                    return new RegExp(match[1], match[2]);
                }
            }

            return null;

        case 'object':
            if (value instanceof context.RegExp || value === null) {
                return value;
            }
        }
    },
    str: function (value) {
        if (typeof value !== 'undefined') {
            return value ? String(value) : '';
        }
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
