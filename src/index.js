const bubble = require('./bubble');
const events = require('./events');
const cursor = require('./cursor');

const XBubbles = Object.create(HTMLElement.prototype, {
    createdCallback: {
        value: function () {
            this.setAttribute('contenteditable', 'true');
            this.setAttribute('spellcheck', 'false');
        }
    },

    attachedCallback: {
        value: function () {
            this.addEventListener('keydown', onKeydown);
            this.addEventListener('keypress', onKeypress);
            this.addEventListener('paste', onPaste);
            this.addEventListener('blur', onBlur);
            this.addEventListener('focus', onFocus);
        }
    },

    detachedCallback: {
        value: function () {
            this.removeEventListener('keydown', onKeydown);
            this.removeEventListener('keypress', onKeypress);
            this.removeEventListener('paste', onPaste);
            this.removeEventListener('blur', onBlur);
            this.removeEventListener('focus', onFocus);
        }
    },

    attributeChangedCallback: {
        value: function () {} // name, previousValue, value
    }
});

module.exports = document.registerElement('x-bubbles', {
    extends: 'div',
    prototype: XBubbles
});

function onKeydown(event) {
    const set = event.currentTarget;
    const code = event.charCode || event.keyCode;

    // Backspace
    if (code === 8) {
        event.preventDefault();
        events.backSpace(event);
    }

    // Tab
    if (code === 9) {
        if (bubble.isBubbleNode(event.target)) {
            event.preventDefault();
            set.focus();
        }
    }

    // Left
    // if (code === 37) {}

    // Right
    // if (code === 39) {}


    // console.log(event.keyCode);
}

function onKeypress(event) {
    const set = event.currentTarget;
    const code = event.charCode || event.keyCode;

    // Enter || , || ;
    if (code === 13 || code === 44 || code === 59) {
        event.preventDefault();
        bubble.bubbling(set);
        cursor.restore(set);
    }
}

function onPaste(event) {
    var set = event.currentTarget;
    setTimeout(function () {
        bubble.bubbling(set);
        cursor.restore(set);
    }, 0);
}

function onBlur(event) {
    bubble.bubbling(event.currentTarget);
}

function onFocus(event) {
    cursor.restore(event.currentTarget);
}
