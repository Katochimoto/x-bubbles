const raf = require('raf');
const context = require('./context');
const { dispatch } = require('./core/event');
const drag = require('./core/drag');
const editor = require('./core/editor');
const bubble = require('./core/bubble');
const bubbleset = require('./core/bubbleset');
const text = require('./core/text');
const cursor = require('./core/cursor');
const { EV } = require('./core/constant');

const dblclick = require('./core/events/dblclick');
const click = require('./core/events/click');
const focus = require('./core/events/focus');
const blur = require('./core/events/blur');

const XBubbles = Object.create(HTMLElement.prototype, {
    createdCallback: {
        value: function () {
            this.setAttribute('contenteditable', 'true');
            this.setAttribute('spellcheck', 'false');

            this.fireInput = throttleRaf(fireInput, this);
            this.fireChange = throttleRaf(fireChange, this);
            this.fireEdit = fireEdit.bind(this);
        }
    },

    attachedCallback: {
        value: function () {
            this.addEventListener('focus', focus);
            this.addEventListener('blur', blur);
            this.addEventListener('click', click);
            this.addEventListener('dblclick', dblclick);

            drag.init(this);
            editor.init(this);
            bubble.bubbling(this);
        }
    },

    detachedCallback: {
        value: function () {
            this.removeEventListener('focus', focus);
            this.removeEventListener('blur', blur);
            this.removeEventListener('click', click);
            this.removeEventListener('dblclick', dblclick);

            drag.destroy(this);
            editor.destroy(this);
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
                    classBubble: 'bubble',
                    draggable: true,
                    separator: /[,;]/,
                    ending: null, // /\@ya\.ru/g;
                    begining: null,
                    bubbleFormation: function () {},
                    bubbleDeformation: function () {},
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

    innerText: {
        get: function () {
            return '';
        },

        set: function (value) {
            while (this.firstChild) {
                this.removeChild(this.firstChild);
            }

            value = text.html2text(value);
            this.appendChild(context.document.createTextNode(value));
            bubble.bubbling(this);
            cursor.restore(this);
        }
    },

    innerHTML: {
        get: function () {
            return '';
        },

        set: function (value) {
            while (this.firstChild) {
                this.removeChild(this.firstChild);
            }

            value = text.html2text(value);
            this.appendChild(context.document.createTextNode(value));
            bubble.bubbling(this);
            cursor.restore(this);
        }
    },

    addBubble: {
        value: function (bubbleText, data) {
            const nodeBubble = bubble.create(this, bubbleText, data);

            if (!nodeBubble) {
                return false;
            }

            text.text2bubble(this, nodeBubble);
            cursor.restore(this);
            return true;
        }
    },

    removeBubble: {
        value: function (nodeBubble) {
            if (this.contains(nodeBubble)) {
                this.removeChild(nodeBubble);
                this.fireChange();
                return true;
            }

            return false;
        }
    },

    editBubble: {
        value: function (nodeBubble) {
            if (this.contains(nodeBubble)) {
                return bubble.edit(this, nodeBubble);
            }

            return false;
        }
    }
});

module.exports = context.document.registerElement('x-bubbles', {
    extends: 'div',
    prototype: XBubbles
});

module.exports = XBubbles;

function optionsPrepare(options) {
    const typeBubbleFormation = typeof options.bubbleFormation;
    const typeBubbleDeformation = typeof options.bubbleDeformation;

    switch (typeBubbleFormation) {
    case 'string':
        options.bubbleFormation = new Function('wrap', `(function(wrap) { ${options.bubbleFormation}(wrap); }(wrap));`);
        break;
    case 'function':
        break;
    default:
        options.bubbleFormation = function () {};
    }

    switch (typeBubbleDeformation) {
    case 'string':
        options.bubbleDeformation = new Function('wrap', `return (function(wrap) { return ${options.bubbleDeformation}(wrap); }(wrap));`);
        break;
    case 'function':
        break;
    default:
        options.bubbleDeformation = function () {};
    }
}

function fireEdit(nodeBubble) {
    dispatch(this, EV.BUBBLE_EDIT, {
        bubbles: false,
        cancelable: false,
        detail: { data: nodeBubble }
    });
}

function fireChange() {
    dispatch(this, EV.CHANGE, {
        bubbles: false,
        cancelable: false
    });
}

function fireInput() {
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
}

function throttleRaf(callback, ctx) {
    let throttle = 0;
    const animationCallback = function () {
        throttle = 0;
    };

    return (function () {
        if (throttle) {
            return;
        }

        throttle = raf(animationCallback);

        callback.apply(ctx || this, arguments);
    });
}
