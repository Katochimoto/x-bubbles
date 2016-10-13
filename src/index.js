const events = require('./x-bubbles/events');
const drag = require('./x-bubbles/drag');
const bubble = require('./x-bubbles/bubble');
const bubbleset = require('./x-bubbles/bubbleset');

const XBubbles = Object.create(HTMLElement.prototype, {
    createdCallback: {
        value: function () {
            this.setAttribute('contenteditable', 'true');
            this.setAttribute('spellcheck', 'false');
        }
    },

    attachedCallback: {
        value: function () {
            this.addEventListener('blur', events.blur);
            this.addEventListener('click', events.click);
            this.addEventListener('dblclick', events.dblclick);
            this.addEventListener('focus', events.focus);
            this.addEventListener('keydown', events.keydown);
            this.addEventListener('keypress', events.keypress);
            this.addEventListener('paste', events.paste);

            drag.init(this);

            bubble.bubbling(this);
        }
    },

    detachedCallback: {
        value: function () {
            this.removeEventListener('blur', events.blur);
            this.removeEventListener('click', events.click);
            this.removeEventListener('dblclick', events.dblclick);
            this.removeEventListener('focus', events.focus);
            this.removeEventListener('keydown', events.keydown);
            this.removeEventListener('keypress', events.keypress);
            this.removeEventListener('paste', events.paste);

            drag.destroy(this);
        }
    },

    attributeChangedCallback: {
        value: function () {} // name, previousValue, value
    },

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

            this.appendChild(document.createTextNode(value));
            bubble.bubbling(this);
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

    switch (typeBubbleFormation) {
    case 'string':
        options.bubbleFormation = new Function('wrap', `(function(wrap) { ${options.bubbleFormation}(wrap); }(wrap));`);
        break;
    case 'function':
        break;
    default:
        options.bubbleFormation = function () {};
    }
}
