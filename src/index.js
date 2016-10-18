const raf = require('raf');
const events = require('./core/events');
const { dispatch } = require('./core/event');
const drag = require('./core/drag');
const editor = require('./core/editor');
const bubble = require('./core/bubble');
const bubbleset = require('./core/bubbleset');
const text = require('./core/text');
const cursor = require('./core/cursor');
const { EV } = require('./core/constant');

const XBubbles = Object.create(HTMLElement.prototype, {
    createdCallback: {
        value: function () {
            this.setAttribute('contenteditable', 'true');
            this.setAttribute('spellcheck', 'false');

            this.fireInput = throttleRaf(fireInput, this);
            this.fireChange = throttleRaf(fireChange, this);
        }
    },

    attachedCallback: {
        value: function () {
            this.addEventListener('focus', events.focus);
            this.addEventListener('blur', events.blur);
            this.addEventListener('click', events.click);
            this.addEventListener('dblclick', events.dblclick);

            drag.init(this);
            editor.init(this);
            bubble.bubbling(this);
        }
    },

    detachedCallback: {
        value: function () {
            this.removeEventListener('focus', events.focus);
            this.removeEventListener('blur', events.blur);
            this.removeEventListener('click', events.click);
            this.removeEventListener('dblclick', events.dblclick);

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
            this.appendChild(document.createTextNode(value));
            bubble.bubbling(this);
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
            this.appendChild(document.createTextNode(value));
            bubble.bubbling(this);
        }
    },

    addBubble: {
        value: function (bubbleText, data) {
            const nodeBubble = bubble.create(this, bubbleText, data);

            if (!nodeBubble) {
                return;
            }

            text.text2bubble(this, nodeBubble);
            cursor.restore(this);
        }
    },

    removeBubble: {
        value: function (nodeBubble) {
            const nodeSet = bubbleset.closestNodeSet(nodeBubble);
            if (nodeSet === this) {
                nodeSet.removeChild(nodeBubble);
                this.fireChange();
            }
        }
    }
});

module.exports = document.registerElement('x-bubbles', {
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

function fireChange() {
    dispatch(this, EV.CHANGE, {
        bubbles: false,
        cancelable: false
    });
}

function fireInput() {
    const textRange = text.currentTextRange();
    if (textRange) {
        const editText = text.textClean(textRange.toString());

        if (this._bubbleValue !== editText) {
            this._bubbleValue = editText;

            dispatch(this, EV.BUBBLE_INPUT, {
                bubbles: false,
                cancelable: false,
                detail: { data: editText }
            });
        }
    }
}

function throttleRaf(callback, context) {
    let throttle = 0;
    const animationCallback = function () {
        throttle = 0;
    };

    return function () {
        if (throttle) {
            return;
        }

        throttle = raf(animationCallback);

        callback.apply(context || this, arguments);
    };
}
