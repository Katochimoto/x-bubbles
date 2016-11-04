const context = require('../context');
const bubbleset = require('./bubbleset');
const bubble = require('./bubble');
const cursor = require('./cursor');
const select = require('./select');
const { KEY } = require('./constant');
const text = require('./text');
const events = require('./events');
const copy = require('./editor/copy');
const raf = require('raf');

const EVENTS = {
    blur: onBlur,
    click: onClick,
    dblclick: onDblclick,
    focus: onFocus,
    keydown: onKeydown,
    keypress: onKeypress,
    keyup: onKeyup,
    paste: onPaste,
};

exports.init = function (nodeSet) {
    events.on(nodeSet, EVENTS);
};

exports.destroy = function (nodeSet) {
    events.off(nodeSet, EVENTS);
};

function onBlur(event) {
    const nodeSet = event.currentTarget;
    if (nodeSet._lockCopy) {
        event.stopImmediatePropagation();
        event.stopPropagation();
        event.preventDefault();
        return;
    }

    select.clear(nodeSet);
    bubble.bubbling(nodeSet);
}

function onFocus(event) {
    const nodeSet = event.currentTarget;
    if (nodeSet._lockCopy) {
        event.stopImmediatePropagation();
        event.stopPropagation();
        event.preventDefault();

        delete nodeSet._lockCopy;

        // Safary 10 не сбрасывает курсор без задержки
        raf(() => {
            const selection = context.getSelection();
            selection && selection.removeAllRanges();
        });
        return;
    }

    cursor.restore(nodeSet);
}

function onKeyup(event) {
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

function onKeypress(event) {
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

function onKeydown(event) {
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

    case KEY.c:
        if (metaKey) {
            copy(nodeSet);
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

function onPaste(event) {
    event.preventDefault();
    const nodeSet = event.currentTarget;

    if (context.clipboardData && context.clipboardData.getData) {
        text.replaceString(context.clipboardData.getData('Text'));
        nodeSet.fireInput();

    } else if (event.clipboardData) {
        const contentType = 'text/plain';
        const clipboardData = event.clipboardData;
        let data = clipboardData.getData && clipboardData.getData(contentType);

        if (text.replaceString(data)) {
            nodeSet.fireInput();

        } else if (clipboardData.items) {
            Array.prototype.slice.call(clipboardData.items)
                .filter(item => item.kind === 'string' && item.type === contentType)
                .some(function (item) {
                    item.getAsString(function (dataPaste) {
                        text.replaceString(dataPaste);
                        nodeSet.fireInput();
                    });

                    return true;
                });
        }
    }
}

function onDblclick(event) {
    const nodeSet = bubbleset.closestNodeSet(event.target);
    const nodeBubble = bubbleset.closestNodeBubble(event.target);

    if (nodeSet && nodeBubble) {
        event.preventDefault();
        bubble.edit(nodeSet, nodeBubble);
    }
}

function onClick(event) {
    const nodeSet = bubbleset.closestNodeSet(event.target);

    if (!nodeSet) {
        return;
    }

    const nodeBubble = bubbleset.closestNodeBubble(event.target);

    if (nodeBubble) {
        if (event.metaKey || event.ctrlKey) {
            select.add(nodeBubble);

        } else if (event.shiftKey) {
            if (!nodeSet.startRangeSelect) {
                select.uniq(nodeBubble);

            } else {
                select.range(nodeBubble);
            }

        } else {
            select.toggleUniq(nodeBubble);
        }

    } else {
        select.clear(nodeSet);

        const selection = context.getSelection();

        if (!selection ||
            !selection.anchorNode ||
            selection.anchorNode.nodeType !== Node.TEXT_NODE) {

            cursor.restore(nodeSet);
        }
    }
}
