const bubble = require('./x-bubbles/bubble');
const events = require('./x-bubbles/events');
const cursor = require('./x-bubbles/cursor');
const select = require('./x-bubbles/select');
const drag = require('./x-bubbles/drag');
const zws = require('./x-bubbles/zws');

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
            this.addEventListener('focus', onFocus);
            this.addEventListener('keydown', onKeydown);
            this.addEventListener('keypress', onKeypress);
            this.addEventListener('paste', onPaste);

            drag.init(this);
        }
    },

    detachedCallback: {
        value: function () {
            this.removeEventListener('blur', onBlur);
            this.removeEventListener('click', onClick);
            this.removeEventListener('dblclick', onDblclick);
            this.removeEventListener('focus', onFocus);
            this.removeEventListener('keydown', onKeydown);
            this.removeEventListener('keypress', onKeypress);
            this.removeEventListener('paste', onPaste);

            drag.destroy(this);
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

    // console.log(code, event.metaKey, event);

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

    case 65: // a
        if (event.metaKey) {
            if (!events.selectAll(event)) {
                select.all(set);
            }
        }
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

function onPaste(event) {
    event.preventDefault();
    events.paste(event);
}

function onBlur(event) {
    const set = event.currentTarget;
    bubble.bubbling(set);
    select.clear(set);
}

function onFocus(event) {
    cursor.restore(event.currentTarget);
}

function onDblclick(event) {
    if (bubble.isBubbleNode(event.target)) {
        event.preventDefault();

        const set = event.currentTarget;
        const node = event.target;
        const fakeText = zws.createElement();
        const text = document.createTextNode(zws.textClean(node.innerText));

        set.replaceChild(text, node);
        set.insertBefore(fakeText, text);

        const sel = window.getSelection();
        if (sel) {
            const range = document.createRange();
            range.setStartBefore(fakeText);
            range.setEndAfter(text);

            sel.removeAllRanges();
            sel.addRange(range);
        }
    }
}

function onClick(event) {
    const set = event.currentTarget;
    const target = event.target;

    if (bubble.isBubbleNode(target)) {
        if (event.metaKey) {
            select.add(target);

        } else if (event.shiftKey) {
            if (!set.startRangeSelect) {
                select.uniq(target);

            } else {
                select.range(target);
            }

        } else {
            select.uniq(target);
        }

    } else {
        select.clear(set);
    }
}
