const raf = require('raf');
const context = require('../context');
const bubbleset = require('./bubbleset');
const bubble = require('./bubble');
const cursor = require('./cursor');
const select = require('./select');
const { KEY } = require('./constant');
const text = require('./text');
const events = require('./events');
const copy = require('./editor/copy');

const EVENTS = {
    blur: onBlur,
    click: onClick,
    dblclick: onDblclick,
    focus: onFocus,
    keydown: onKeydown,
    keypress: onKeypress,
    keyup: onKeyup,
    mscontrolselect: events.prevent,
    paste: onPaste,
    resize: events.prevent,
    resizestart: events.prevent,
};

exports.init = function (nodeEditor) {
    nodeEditor.setAttribute('contenteditable', 'true');
    nodeEditor.setAttribute('spellcheck', 'false');

    nodeEditor.fireChange = events.throttle(events.fireChange);
    nodeEditor.fireEdit = events.throttle(events.fireEdit);
    nodeEditor.fireInput = events.throttle(events.fireInput);

    events.on(nodeEditor, EVENTS);

    return {
        addBubble: addBubble.bind(nodeEditor),
        editBubble: editBubble.bind(nodeEditor),
        removeBubble: removeBubble.bind(nodeEditor),
        setContent: setContent.bind(nodeEditor),
    };
};

exports.destroy = function (nodeEditor) {
    events.off(nodeEditor, EVENTS);
};

function onBlur(event) {
    const nodeEditor = event.currentTarget;
    if (nodeEditor._lockCopy) {
        return events.prevent(event);
    }

    select.clear(nodeEditor);
    bubble.bubbling(nodeEditor);
}

function onFocus(event) {
    const nodeEditor = event.currentTarget;
    if (nodeEditor._lockCopy) {
        events.prevent(event);
        delete nodeEditor._lockCopy;

        // Safary 10 не сбрасывает курсор без задержки
        raf(() => {
            const selection = context.getSelection();
            selection && selection.removeAllRanges();
        });

        return false;
    }

    cursor.restore(nodeEditor);
}

function onKeyup(event) {
    const nodeEditor = event.currentTarget;
    const code = events.keyCode(event);
    const isPrintableChar = do {
        if (event.key) {
            event.key.length === 1;

        } else {
            ((code > 47 || code === KEY.Space || code === KEY.Backspace) && code !== KEY.Cmd);
        }
    };

    if (isPrintableChar) {
        nodeEditor.fireInput();
    }
}

function onKeypress(event) {
    const code = events.keyCode(event);
    const nodeEditor = event.currentTarget;

    /* eslint no-case-declarations: 0 */
    switch (code) {
    case KEY.Enter:
        event.preventDefault();
        if (!nodeEditor.options('disableControls')) {
            bubble.bubbling(nodeEditor);
            cursor.restore(nodeEditor);
        }
        break;

    case KEY.Comma:
    case KEY.Semicolon:
        event.preventDefault();
        bubble.bubbling(nodeEditor);
        cursor.restore(nodeEditor);
        break;
    }
}

function onKeydown(event) {
    const code = events.keyCode(event);
    const metaKey = events.metaKey(event);
    const nodeEditor = event.currentTarget;
    const enable = !nodeEditor.options('disableControls');

    switch (code) {
    case KEY.Esc:
        event.preventDefault();
        bubble.bubbling(nodeEditor);
        cursor.restore(nodeEditor);
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
            const headBubble = bubbleset.headBubble(nodeEditor);
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
        if (enable && select.has(nodeEditor)) {
            cursor.restore(nodeEditor);
        }
        break;

    case KEY.a:
        if (metaKey) {
            event.preventDefault();

            if (!text.selectAll(null, event.currentTarget)) {
                select.all(nodeEditor);
            }
        }
        break;

    case KEY.c:
        if (metaKey) {
            copy(nodeEditor);
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
        if (events.metaKey(event)) {
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

function setContent(data) {
    while (this.firstChild) {
        this.removeChild(this.firstChild);
    }

    data = text.html2text(data);
    this.appendChild(context.document.createTextNode(data));
    bubble.bubbling(this);
    cursor.restore(this);
}

function addBubble(bubbleText, data) {
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

function removeBubble(nodeBubble) {
    if (this.contains(nodeBubble)) {
        this.removeChild(nodeBubble);
        this.fireChange();
        return true;
    }

    return false;
}

function editBubble(nodeBubble) {
    if (this.contains(nodeBubble)) {
        return bubble.edit(this, nodeBubble);
    }

    return false;
}
