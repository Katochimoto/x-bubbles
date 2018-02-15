const context = require('../context');
const bubbleset = require('./bubbleset');
const bubble = require('./bubble');
const cursor = require('./cursor');
const { EV, PROPS } = require('./constant');
const text = require('./text');
const events = require('./events');
const utils = require('./utils');
const drag = require('./drag');
const select = require('./select');

const COMMON_EVENTS = {
    blur: require('./common/blur'),
    click: require('./common/click'),
    focus: require('./common/focus'),
    keydown: require('./common/keydown'),
};

const EDITOR_EVENTS = {
    blur: require('./editor/blur'),
    click: require('./editor/click'),
    focus: require('./editor/focus'),
    keydown: require('./editor/keydown'),
    keypress: require('./editor/keypress'),
    keyup: require('./editor/keyup'),
    paste: require('./editor/paste'),
};

const SELECT_EVENTS = {
    blur: require('./select/blur'),
    click: require('./select/click'),
    keydown: require('./select/keydown'),
    keypress: require('./select/keypress'),
};

const PROXY_EVENTS = {
    blur: events.proxyLocal,
    click: events.proxyLocal,
    focus: events.proxyLocal,
    keydown: events.proxyLocal,
    keypress: events.proxyLocal,
    keyup: events.proxyLocal,
    mscontrolselect: events.prevent,
    paste: events.proxyLocal,
    resize: events.prevent,
    resizestart: events.prevent,
};

exports.init = function (nodeWrap) {
    const nodeEditor = nodeWrap;
    nodeEditor.setAttribute('contenteditable', 'true');
    nodeEditor.setAttribute('spellcheck', 'false');

    events.onLocal(nodeEditor, COMMON_EVENTS);
    events.onLocal(nodeEditor, EDITOR_EVENTS);

    if (nodeEditor.options('selection')) {
        events.onLocal(nodeEditor, SELECT_EVENTS);
        drag.init(nodeEditor);
    }

    events.on(nodeEditor, PROXY_EVENTS);

    nodeEditor.fireChange = utils.throttle(fireChange, nodeEditor);
    nodeEditor.fireEdit = utils.throttle(fireEdit, nodeEditor);
    nodeEditor.fireInput = utils.throttle(fireInput, nodeEditor);
    nodeEditor.fireBeforeRemove = fireBeforeRemove.bind(nodeEditor);

    return {
        canAddBubble: canAddBubble.bind(nodeEditor),
        addBubble: addBubble.bind(nodeEditor),
        bubbling: bubbling.bind(nodeEditor),
        editBubble: editBubble.bind(nodeEditor),
        getItems: getItems.bind(nodeEditor),
        inputValue: inputValue.bind(nodeEditor),
        removeBubble: removeBubble.bind(nodeEditor),
        setContent: setContent.bind(nodeEditor)
    };
};

exports.destroy = function (nodeWrap) {
    const nodeEditor = nodeWrap;
    events.off(nodeEditor, PROXY_EVENTS);
    events.offLocal(nodeEditor, COMMON_EVENTS);
    events.offLocal(nodeEditor, EDITOR_EVENTS);

    if (nodeEditor.options('selection')) {
        events.offLocal(nodeEditor, SELECT_EVENTS);
        drag.destroy(nodeEditor);
    }
};

function canAddBubble() {
    return bubbleset.canAddBubble(this);
}

function getItems() {
    return bubbleset.getBubbles(this);
}

function setContent(data) {
    const selection = context.getSelection();
    selection && selection.removeAllRanges();

    const list = select.get(this);
    if (list.length) {
        bubbleset.removeBubbles(this, list);
        this.fireChange();
    }

    while (this.firstChild) {
        this.removeChild(this.firstChild);
    }

    data = text.html2text(data);
    this.appendChild(this.ownerDocument.createTextNode(data));
    bubble.bubbling(this);
    cursor.restore(this);

    return true;
}

function addBubble(bubbleText, dataAttributes) {
    const nodeBubble = bubble.create(this, bubbleText, dataAttributes);
    if (!this.canAddBubble() || !nodeBubble) {
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
        bubbleset.removeBubbles(this, [ nodeBubble ]);
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

function bubbling() {
    bubble.bubbling(this);
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

/**
 * Генерация события удаления баблов перед выполнением удаления из DOM.
 * Выполняется в контексте узла-обертки.
 * @alias module:x-bubbles/editor.fireRemove
 * @param {array} list список удаляемых узлов
 * @this HTMLElement
 * @private
 */
function fireBeforeRemove(list) {
    events.dispatch(this, EV.BEFORE_REMOVE, {
        bubbles: false,
        cancelable: false,
        detail: { data: list }
    });
}
