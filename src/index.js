const bubble = require('./bubble');
const events = require('./events');
const cursor = require('./cursor');
const select = require('./select');

const XBubbles = Object.create(HTMLElement.prototype, {
    createdCallback: {
        value: function () {
            this.setAttribute('contenteditable', 'true');
            this.setAttribute('spellcheck', 'false');
        }
    },

    attachedCallback: {
        value: function () {
            this.addEventListener('blur', onBlur);
            this.addEventListener('click', onClick);
            this.addEventListener('dblclick', onDblclick);
            this.addEventListener('drop', onDrop);
            this.addEventListener('focus', onFocus);
            this.addEventListener('keydown', onKeydown);
            this.addEventListener('keypress', onKeypress);
            this.addEventListener('paste', onPaste);
        }
    },

    detachedCallback: {
        value: function () {
            this.removeEventListener('blur', onBlur);
            this.removeEventListener('click', onClick);
            this.removeEventListener('dblclick', onDblclick);
            this.removeEventListener('drop', onDrop);
            this.removeEventListener('focus', onFocus);
            this.removeEventListener('keydown', onKeydown);
            this.removeEventListener('keypress', onKeypress);
            this.removeEventListener('paste', onPaste);
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
    const code = event.charCode || event.keyCode;

    // console.log(event.keyCode);

    switch (code) {
    case 8: // Backspace
        events.backSpace(event);
        break;

    case 9: // Tab
        events.tab(event);
        break;

    case 37: // Left
        events.arrowLeft(event);
        break;

    // сдвигаем курсор в начало списка
    case 38: // Top
        events.arrowTop(event);
        break;

    case 39: // Right
        events.arrowRight(event);
        break;

    // сдвигаем курсор в конец списка
    case 40: // Bottom
        events.arrowBottom(event);
        break;
    }
}

function onKeypress(event) {
    const code = event.charCode || event.keyCode;

    switch (code) {
    case 13: // Enter
    case 44: // ,
    case 59: // ;
        event.preventDefault();
        const set = event.currentTarget;
        bubble.bubbling(set);
        cursor.restore(set);
        break;
    }
}

function onDrop(event) {
    event.preventDefault();
    // var data = event.dataTransfer.getData('text/plain');
}

function onPaste(event) {
    event.preventDefault();
    events.paste(event);
}

function onBlur(event) {
    bubble.bubbling(event.currentTarget);
}

function onFocus(event) {
    cursor.restore(event.currentTarget);
}

function onDblclick(event) {
    if (bubble.isBubbleNode(event.target)) {
        event.preventDefault();
        console.log('>>');
    }
}

function onClick(event) {
    const target = event.target;
    if (bubble.isBubbleNode(target)) {
        if (event.metaKey) {
            select.add(target);

        } else if (event.shiftKey) {
            select.range(target);

        } else {
            select.uniq(target);
        }

    } else {
        select.clear(event.currentTarget);
    }
}
