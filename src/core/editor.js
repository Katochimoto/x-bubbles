const raf = require('raf');
const context = require('../context');
const bubbleset = require('./bubbleset');
const bubble = require('./bubble');
const cursor = require('./cursor');
const select = require('./select');
const { KEY, EV, PROPS } = require('./constant');
const text = require('./text');
const events = require('./events');
const utils = require('./utils');
const copy = require('./editor/copy');
const paste = require('./editor/paste');

const EVENTS = {
    blur: onBlur,
    click: onClick,
    focus: onFocus,
    keydown: onKeydown,
    keypress: onKeypress,
    keyup: onKeyup,
    mscontrolselect: events.prevent,
    paste: paste,
    resize: events.prevent,
    resizestart: events.prevent,
};

exports.init = function (nodeWrap) {
    const nodeEditor = nodeWrap;
    nodeEditor.setAttribute('contenteditable', 'true');
    nodeEditor.setAttribute('spellcheck', 'false');

    nodeEditor.fireChange = utils.throttle(fireChange, nodeWrap);
    nodeEditor.fireEdit = utils.throttle(fireEdit, nodeWrap);
    nodeEditor.fireInput = utils.throttle(fireInput, nodeWrap);

    events.on(nodeEditor, EVENTS);

    return {
        addBubble: addBubble.bind(nodeEditor),
        editBubble: editBubble.bind(nodeEditor),
        inputValue: inputValue.bind(nodeEditor),
        removeBubble: removeBubble.bind(nodeEditor),
        setContent: setContent.bind(nodeEditor),
    };
};

exports.destroy = function (nodeEditor) {
    events.off(nodeEditor, EVENTS);
};

function onBlur(event) {
    const nodeEditor = event.currentTarget;
    if (nodeEditor[ PROPS.LOCK_COPY ]) {
        return events.prevent(event);
    }

    select.clear(nodeEditor);
    bubble.bubbling(nodeEditor);
}

function onFocus(event) {
    const nodeEditor = event.currentTarget;
    if (nodeEditor[ PROPS.LOCK_COPY ]) {
        events.prevent(event);
        delete nodeEditor[ PROPS.LOCK_COPY ];

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
            if (!editBubbleKeyboardEvent(nodeEditor)) {
                bubble.bubbling(nodeEditor);
                cursor.restore(nodeEditor);
            }
        }
        break;

    case KEY.Space:
        if (editBubbleKeyboardEvent(nodeEditor)) {
            event.preventDefault();
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

    case KEY.Delete:
        event.preventDefault();
        deleteKeyboardEvent(event);
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
            copy(event);
        }
        break;

    case KEY.x:
        if (metaKey) {
            copy(event, function () {
                backSpaceBubbles(nodeEditor);
            });
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

/**
 * Реакция на событие нажатия на кнопку Backspace.
 * Нельзя выполнять normalize() перед выполнением, иначе в ИЕ сбивается Selection.
 * @param {Event} event
 */
function backSpace(event) {
    const nodeEditor = event.currentTarget;
    const selection = context.getSelection();

    if (!selection) {
        return;
    }

    if (selection.isCollapsed) {
        if (text.arrowLeft(selection, true)) {
            text.remove(selection);
            nodeEditor.fireInput();
            return;
        }

    } else {
        text.remove(selection);
        nodeEditor.fireInput();
        return;
    }

    let node = bubbleset.findBubbleLeft(selection);
    if (node) {
        select.uniq(node);
        return;
    }

    backSpaceBubbles(nodeEditor);
}

/**
 * Реакция на событие нажатия на кнопку Delete.
 * Нельзя выполнять normalize() перед выполнением, иначе в ИЕ сбивается Selection.
 * @param {Event} event
 */
function deleteKeyboardEvent(event) {
    const nodeEditor = event.currentTarget;
    const selection = context.getSelection();

    if (!selection) {
        return;
    }

    if (selection.isCollapsed) {
        if (text.arrowRight(selection, true)) {
            text.remove(selection);
            nodeEditor.fireInput();
            return;
        }

    } else {
        text.remove(selection);
        nodeEditor.fireInput();
        return;
    }

    let node = bubbleset.findBubbleRight(selection);
    if (node) {
        select.uniq(node);
        return;
    }

    deleteBubbles(nodeEditor);
}

function backSpaceBubbles(nodeEditor) {
    const list = select.get(nodeEditor);
    if (!list.length) {
        return;
    }

    const prevBubble = list[ 0 ].previousSibling;
    const nextBubble = list[ list.length - 1 ].nextSibling;

    list.forEach(item => item.parentNode.removeChild(item));

    if (bubble.isBubbleNode(prevBubble)) {
        select.uniq(prevBubble);

    } else if (bubble.isBubbleNode(nextBubble)) {
        select.uniq(nextBubble);

    } else {
        nodeEditor.focus();
        cursor.restore(nodeEditor);
    }

    nodeEditor.fireChange();
}

function deleteBubbles(nodeEditor) {
    const list = select.get(nodeEditor);
    if (!list.length) {
        return;
    }

    const prevBubble = list[ 0 ].previousSibling;
    const nextBubble = list[ list.length - 1 ].nextSibling;

    list.forEach(item => item.parentNode.removeChild(item));

    if (bubble.isBubbleNode(nextBubble)) {
        select.uniq(nextBubble);

    } else if (bubble.isBubbleNode(prevBubble)) {
        select.uniq(prevBubble);

    } else {
        nodeEditor.focus();
        cursor.restore(nodeEditor);
    }

    nodeEditor.fireChange();
}

function onClick(event) {
    const nodeSet = bubbleset.closestNodeSet(event.target);

    if (!nodeSet) {
        return;
    }

    const nodeBubble = bubbleset.closestNodeBubble(event.target);

    if (nodeBubble) {
        const clickTime = Date.now();
        const isDblclick = nodeSet[ PROPS.CLICK_TIME ] && (clickTime - nodeSet[ PROPS.CLICK_TIME ]) < 200;

        nodeSet[ PROPS.CLICK_TIME ] = clickTime;

        if (events.metaKey(event)) {
            select.add(nodeBubble);

        } else if (event.shiftKey) {
            if (!nodeSet.startRangeSelect) {
                select.uniq(nodeBubble);

            } else {
                select.range(nodeBubble);
            }

        } else if (isDblclick) {
            bubble.edit(nodeSet, nodeBubble);

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

function editBubbleKeyboardEvent(nodeEditor) {
    const selection = context.getSelection();

    if (!selection || !selection.rangeCount) {
        const list = select.get(nodeEditor);

        if (list.length === 1) {
            return bubble.edit(nodeEditor, list[0]);
        }
    }

    return false;
}

function setContent(data) {
    var selection = context.getSelection();
    selection && selection.removeAllRanges();

    while (this.firstChild) {
        this.removeChild(this.firstChild);
    }

    data = text.html2text(data);
    this.appendChild(this.ownerDocument.createTextNode(data));
    bubble.bubbling(this);
    cursor.restore(this);
}

function addBubble(bubbleText, dataAttributes) {
    const nodeBubble = bubble.create(this, bubbleText, dataAttributes);
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

function inputValue() {
    const textRange = text.currentTextRange(this);
    return textRange && text.textClean(textRange.toString()) || '';
}

/**
 * Генерация события редактирования бабла.
 * Выполняется в контексте узла-обертки.
 * @alias module:x-bubbles/editor.fireEdit
 * @param {HTMLElement} nodeBubble нода бабл
 * @this HTMLElement
 * @private
 */
function fireEdit(nodeBubble) {
    events.dispatch(this, EV.BUBBLE_EDIT, {
        bubbles: false,
        cancelable: false,
        detail: { data: nodeBubble }
    });
}

/**
 * Генерация события изменения набора баблов.
 * Выполняется в контексте узла-обертки.
 * @alias module:x-bubbles/editor.fireChange
 * @this HTMLElement
 * @private
 */
function fireChange() {
    events.dispatch(this, EV.CHANGE, {
        bubbles: false,
        cancelable: false
    });
}

/**
 * Генерация события ввода текста.
 * Выполняется в контексте узла-обертки.
 * @alias module:x-bubbles/editor.fireInput
 * @this HTMLElement
 * @private
 */
function fireInput() {
    const editText = inputValue.call(this);

    if (this[ PROPS.BUBBLE_VALUE ] !== editText) {
        this[ PROPS.BUBBLE_VALUE ] = editText;

        events.dispatch(this, EV.BUBBLE_INPUT, {
            bubbles: false,
            cancelable: false,
            detail: { data: editText }
        });
    }
}
