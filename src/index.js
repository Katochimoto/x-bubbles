const context = require('./context');
const events = require('./core/events');
const drag = require('./core/drag');
const editor = require('./core/editor');
const bubble = require('./core/bubble');
const bubbleset = require('./core/bubbleset');
const text = require('./core/text');
const cursor = require('./core/cursor');

const XBubbles = Object.create(HTMLDivElement.prototype, {
    createdCallback: {
        value: function () {
            this.setAttribute('contenteditable', 'true');
            this.setAttribute('spellcheck', 'false');

            this.fireChange = events.throttle(events.fireChange);
            this.fireEdit = events.throttle(events.fireEdit);
            this.fireInput = events.throttle(events.fireInput);

            this.addEventListener('resize', events.prevent);
            this.addEventListener('resizestart', events.prevent);
            this.addEventListener('mscontrolselect', events.prevent);
        }
    },

    attachedCallback: {
        value: function () {
            drag.init(this);
            editor.init(this);
            bubble.bubbling(this);
        }
    },

    detachedCallback: {
        value: function () {
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

    setContent: {
        value: function (data) {
            while (this.firstChild) {
                this.removeChild(this.firstChild);
            }

            data = text.html2text(data);
            this.appendChild(context.document.createTextNode(data));
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

            if (text.text2bubble(this, nodeBubble)) {
                cursor.restore(this);
                return true;
            }

            return false;
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

function optionsPrepare(options) {
    const typeBubbleFormation = typeof options.bubbleFormation;
    const typeBubbleDeformation = typeof options.bubbleDeformation;
    const typeDraggable = typeof options.draggable;

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

    switch (typeDraggable) {
    case 'string':
        options.draggable = (options.draggable === 'true' || options.draggable === 'on');
        break;
    case 'boolean':
        break;
    default:
        options.draggable = true;
    }
}
