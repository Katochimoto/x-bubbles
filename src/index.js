const events = require('./x-bubbles/events');
const drag = require('./x-bubbles/drag');

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
        value: function (name) {
            if (!this._options) {
                this._options = {
                    classBubble: 'bubble',
                    classBubbleSelect: 'is-select',
                    ...this.dataset
                };
            }

            return this._options[ name ];
        }
    }
});

module.exports = document.registerElement('x-bubbles', {
    extends: 'div',
    prototype: XBubbles
});

module.exports = XBubbles;
