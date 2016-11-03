const context = require('./context');
const events = require('./core/events');
const drag = require('./core/drag');
const editor = require('./core/editor');
const bubble = require('./core/bubble');
const bubbleset = require('./core/bubbleset');
const text = require('./core/text');
const cursor = require('./core/cursor');

const OPTIONS = {
    begining:           [ 'noop', null ],
    bubbleDeformation:  [ 'funk', function () {} ],
    bubbleFormation:    [ 'funk', function () {} ],
    classBubble:        [ 'noop', 'bubble' ],
    draggable:          [ 'bool', true ],
    ending:             [ 'noop', null ], // /\@ya\.ru/g;
    separator:          [ 'noop', /[,;]/ ],
};

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
                this.fireInput();
                this.fireChange();
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
