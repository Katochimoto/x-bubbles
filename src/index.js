const bubble = require('./bubble');
const events = require('./events');
const utils = require('./utils');

const XBubbles = Object.create(HTMLElement.prototype, {
    createdCallback: {
        value: function () {
            this.setAttribute('contenteditable', 'true');
            this.setAttribute('spellcheck', 'false');
        }
    },

    attachedCallback: {
        value: function () {
            this.addEventListener('keydown', onKeydown, false);
            this.addEventListener('keypress', onKeypress, false);
            this.addEventListener('paste', onPaste, false);
            this.addEventListener('blur', onBlur, false);
            this.addEventListener('focus', onFocus, false);
        }
    },

    detachedCallback: {
        value: function () {
            this.removeEventListener('keydown', onKeydown, false);
            this.removeEventListener('keypress', onKeypress, false);
            this.removeEventListener('paste', onPaste, false);
            this.removeEventListener('blur', onBlur, false);
            this.removeEventListener('focus', onFocus, false);
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
    var set = event.currentTarget;
    var code = event.charCode || event.keyCode;

    if (code === 13) {
        // event.preventDefault();
    }

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
    var set = event.currentTarget;
    var code = event.charCode || event.keyCode;

    // Enter
    if (code === 13) {
        event.preventDefault();
    }

    // Backspace
    if (code === 8) {
        event.preventDefault();
    }

    // Enter || , || ;
    if (code === 13 || code === 44 || code === 59) {
        event.preventDefault();
        bubble.bubbling(set);
        utils.restoreCursor(set);
    }
}

function onPaste(event) {
    var set = event.currentTarget;
    setTimeout(function () {
        bubble.bubbling(set);
        utils.restoreCursor(set);
    }, 0);
}

function onBlur(event) {
    var set = event.currentTarget;
    bubble.bubbling(set);
}

function onFocus(event) {
    var set = event.currentTarget;
    utils.restoreCursor(set);
}
