const bubbleset = require('./bubbleset');
const bubble = require('./bubble');
const cursor = require('./cursor');
const select = require('./select');
const { KEY } = require('./constant');
const context = require('../context');
const text = require('./text');

exports.init = function (nodeSet) {
    nodeSet.addEventListener('focus', focus);
    nodeSet.addEventListener('blur', blur);
    nodeSet.addEventListener('keyup', keyup);
    nodeSet.addEventListener('keydown', keydown);
    nodeSet.addEventListener('keypress', keypress);
    nodeSet.addEventListener('paste', paste);
};

exports.destroy = function (nodeSet) {
    nodeSet.removeEventListener('focus', focus);
    nodeSet.removeEventListener('blur', blur);
    nodeSet.removeEventListener('keyup', keyup);
    nodeSet.removeEventListener('keydown', keydown);
    nodeSet.removeEventListener('keypress', keypress);
    nodeSet.removeEventListener('paste', paste);
};

function keyup(event) {
    const code = event.charCode || event.keyCode;
    const isPrintableChar = do {
        if (event.key) {
            event.key.length === 1;
        } else {
            ((code > 47 || code === KEY.Space || code === KEY.Backspace) && code !== KEY.Cmd);
        }
    };

    if (isPrintableChar) {
        event.currentTarget.fireInput();
    }
}

function keypress(event) {
    const code = event.charCode || event.keyCode;
    const nodeSet = event.currentTarget;

    /* eslint no-case-declarations: 0 */
    switch (code) {
    case KEY.Enter:
        event.preventDefault();
        if (!nodeSet.hasAttribute('disable-controls')) {
            bubble.bubbling(nodeSet);
            cursor.restore(nodeSet);
        }
        break;

    case KEY.Comma:
    case KEY.Semicolon:
        event.preventDefault();
        bubble.bubbling(nodeSet);
        cursor.restore(nodeSet);
        break;
    }
}

function keydown(event) {
    const code = event.charCode || event.keyCode;
    const metaKey = event.ctrlKey || event.metaKey;
    const nodeSet = event.currentTarget;
    const enable = !nodeSet.hasAttribute('disable-controls');

    switch (code) {
    case KEY.Esc:
        event.preventDefault();
        bubble.bubbling(nodeSet);
        cursor.restore(nodeSet);
        break;

    case KEY.Backspace:
        event.preventDefault();
        backSpace(event);
        break;

    case KEY.Left:
        event.preventDefault();
        arrowLeft(event);
        break;

    // сдвигаем курсор в начало списка
    case KEY.Top:
        event.preventDefault();
        if (enable) {
            const headBubble = bubbleset.headBubble(nodeSet);
            headBubble && select.uniq(headBubble);
        }
        break;

    case KEY.Right:
        event.preventDefault();
        arrowRight(event);
        break;

    // сдвигаем курсор в конец списка
    // case KEY.Tab:
    case KEY.Bottom:
        event.preventDefault();
        if (enable && select.has(nodeSet)) {
            cursor.restore(nodeSet);
        }
        break;

    case KEY.a:
        if (metaKey) {
            event.preventDefault();

            if (!text.selectAll(null, event.currentTarget)) {
                select.all(nodeSet);
            }
        }
        break;
    }
}

function arrowLeft(event) {
    const selection = context.getSelection();

    if (text.arrowLeft(selection, event.shiftKey)) {
        return;
    }

    if (selection.anchorNode && selection.anchorNode.nodeType === Node.TEXT_NODE) {
        const nodeBubble = bubbleset.prevBubble(selection.anchorNode);
        nodeBubble && select.uniq(nodeBubble);
        return;
    }

    const nodeSet = event.currentTarget;
    const list = select.get(nodeSet);
    const begin = do {
        if (list.length > 1 && list[ 0 ] === nodeSet.startRangeSelect) {
            list[ list.length - 1 ];

        } else {
            list[ 0 ];
        }
    };

    const node = bubbleset.prevBubble(begin);

    if (node) {
        if (event.shiftKey) {
            select.range(node);

        } else {
            select.uniq(node);
        }
    }
}

function arrowRight(event) {
    const selection = context.getSelection();

    if (text.arrowRight(selection, event.shiftKey)) {
        return;
    }

    if (selection.focusNode && selection.focusNode.nodeType === Node.TEXT_NODE) {
        const nodeBubble = bubbleset.nextBubble(selection.focusNode);
        nodeBubble && select.uniq(nodeBubble);
        return;
    }

    const nodeSet = event.currentTarget;
    const list = select.get(nodeSet);
    const begin = do {
        if (list.length > 1 && list[ list.length - 1 ] === nodeSet.startRangeSelect) {
            list[ 0 ];

        } else {
            list[ list.length - 1 ];
        }
    };

    const node = bubbleset.nextBubble(begin);

    if (node) {
        if (event.shiftKey) {
            select.range(node);

        } else {
            select.uniq(node);
        }

    } else if (begin && begin.nextSibling && begin.nextSibling.nodeType === Node.TEXT_NODE) {
        select.clear(nodeSet);
        selection.collapse(begin.nextSibling, 0);

    } else {
        cursor.restore(nodeSet);
    }
}

function backSpace(event) {
    const nodeSet = event.currentTarget;
    nodeSet.normalize();

    const selection = context.getSelection();
    if (!selection) {
        return;
    }

    if (selection.isCollapsed) {
        if (text.arrowLeft(selection, true)) {
            text.remove(selection);
            nodeSet.fireInput();
            return;
        }

    } else {
        text.remove(selection);
        nodeSet.fireInput();
        return;
    }

    let node = bubbleset.findBubbleLeft(selection);
    if (node) {
        select.uniq(node);
        return;
    }

    const list = select.get(nodeSet);

    if (list.length) {
        const prevBubble = list[ 0 ].previousSibling;
        const nextBubble = list[ list.length - 1 ].nextSibling;
        list.forEach(item => item.parentNode.removeChild(item));

        if (bubble.isBubbleNode(prevBubble)) {
            select.uniq(prevBubble);

        } else if (bubble.isBubbleNode(nextBubble)) {
            select.uniq(nextBubble);

        } else {
            nodeSet.focus();
            cursor.restore(nodeSet);
        }

        nodeSet.fireChange();
    }
}

function paste(event) {
    event.preventDefault();

    const clipboardData = event.clipboardData;
    if (!clipboardData) {
        return;
    }

    const contentType = 'text/plain';
    let data = clipboardData.getData && clipboardData.getData(contentType);

    if (!text.replaceString(data) && clipboardData.items) {
        Array.prototype.slice.call(clipboardData.items)
            .filter(item => item.kind === 'string' && item.type === contentType)
            .some(function (item) {
                item.getAsString(text.replaceString);
                return true;
            });
    }
}

function blur(event) {
    select.clear(event.currentTarget);
    bubble.bubbling(event.currentTarget);
}

function focus(event) {
    cursor.restore(event.currentTarget);
}
