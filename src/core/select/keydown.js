const raf = require('raf');
const events = require('../events');
const utils = require('../utils');
const bubble = require('../bubble');
const select = require('../select');
const bubbleset = require('../bubbleset');
const cursor = require('../cursor');
const { KEY, PROPS } = require('../constant');

/**
 * @param {Event} event
 * @param {Object} sharedData
 * @param {boolean} [sharedData.isTextSelectAll]
 * @param {boolean} [sharedData.isTextSelectedFromBeginToCursor]
 * @param {boolean} [sharedData.isEmptyLeft]
 * @param {boolean} [sharedData.isEmptyRight]
 * @param {Selection} [sharedData.selection]
 * @param {HTMLElement} [sharedData.nodeEditor]
 */
module.exports = function (event, sharedData) {
    const code = events.keyCode(event);
    const metaKey = events.metaKey(event);

    switch (code) {
    case KEY.Backspace:
        onBackspace(event, sharedData);
        break;

    case KEY.Delete:
        onDelete(event, sharedData);
        break;

    case KEY.Left:
        onArrowLeft(event, sharedData);
        break;

    case KEY.Right:
        onArrowRight(event, sharedData);
        break;

    // курсор в начало списка
    case KEY.Top:
        event.preventDefault();
        onTop(event, sharedData);
        break;

    // курсор в конец списка
    case KEY.Bottom:
        event.preventDefault();
        onBottom(event, sharedData);
        break;

    case KEY.Home:
        if (event.shiftKey && !sharedData.isTextSelectedFromBeginToCursor && select.has(sharedData.nodeEditor)) {
            event.preventDefault();
            select.allLeft(sharedData.nodeEditor);
        }

        break;

    case KEY.a:
        if (metaKey && !sharedData.isTextSelectAll) {
            event.preventDefault();
            select.all(sharedData.nodeEditor);
        }
        break;

    case KEY.c:
        metaKey && copyBubbles(sharedData.nodeEditor);
        break;

    case KEY.x:
        metaKey && copyBubbles(sharedData.nodeEditor, () => onDelete(event, sharedData));
        break;
    }
};

/**
 * @param {Event} event
 * @param {Object} sharedData
 * @param {HTMLElement} [sharedData.nodeEditor]
 */
function onTop(event, sharedData) {
    const nodeEditor = sharedData.nodeEditor;
    if (nodeEditor.options('disableControls')) {
        return;
    }

    const nodeBubble = bubbleset.headBubble(nodeEditor);
    nodeBubble && select.uniq(nodeBubble);
}

/**
 * @param {Event} event
 * @param {Object} sharedData
 * @param {HTMLElement} [sharedData.nodeEditor]
 */
function onBottom(event, sharedData) {
    const nodeEditor = sharedData.nodeEditor;
    if (nodeEditor.options('disableControls')) {
        return;
    }

    if (select.has(nodeEditor)) {
        cursor.restore(nodeEditor);
    }
}

/**
 * @param {Event} event
 * @param {Object} sharedData
 * @param {boolean} [sharedData.isEmptyLeft]
 * @param {Selection} [sharedData.selection]
 * @param {HTMLElement} [sharedData.nodeEditor]
 */
function onBackspace(event, sharedData) {
    const nodeEditor = sharedData.nodeEditor;
    const selection = sharedData.selection;

    if (selection) {
        if (sharedData.isEmptyLeft) {
            const nodeBubble = bubbleset.findBubbleLeft(selection);
            nodeBubble && select.uniq(nodeBubble);
        }

    } else if (!removeBubbles(nodeEditor)) {
        nodeEditor.focus();
        // без задержки не восстанавливает курсор
        raf(() => cursor.restore(nodeEditor));
    }
}

/**
 * @param {Event} event
 * @param {Object} sharedData
 * @param {boolean} [sharedData.isEmptyRight]
 * @param {Selection} [sharedData.selection]
 * @param {HTMLElement} [sharedData.nodeEditor]
 */
function onDelete(event, sharedData) {
    const nodeEditor = sharedData.nodeEditor;
    const selection = sharedData.selection;

    if (selection) {
        if (sharedData.isEmptyRight) {
            const nodeBubble = bubbleset.findBubbleRight(selection);
            nodeBubble && select.uniq(nodeBubble);
        }

    } else if (!removeBubbles(nodeEditor, true)) {
        nodeEditor.focus();
        // без задержки не восстанавливает курсор
        raf(() => cursor.restore(nodeEditor));
    }
}

/**
 * @param {Event} event
 * @param {Object} sharedData
 * @param {boolean} [sharedData.isEmptyLeft]
 * @param {Selection} [sharedData.selection]
 * @param {HTMLElement} [sharedData.nodeEditor]
 */
function onArrowLeft(event, sharedData) {
    const selection = sharedData.selection;

    if (selection) {
        if (sharedData.isEmptyLeft) {
            const nodeBubble = bubbleset.findBubbleLeft(selection);
            nodeBubble && select.uniq(nodeBubble);
        }

    } else {
        const nodeEditor = sharedData.nodeEditor;
        const list = select.get(nodeEditor);
        const begin = do {
            if (list.length > 1 && list[ 0 ] === nodeEditor.startRangeSelect) {
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
}

/**
 * @param {Event} event
 * @param {Object} sharedData
 * @param {boolean} [sharedData.isEmptyRight]
 * @param {Selection} [sharedData.selection]
 * @param {HTMLElement} [sharedData.nodeEditor]
 */
function onArrowRight(event, sharedData) {
    const selection = sharedData.selection;

    if (selection) {
        if (sharedData.isEmptyRight) {
            const nodeBubble = bubbleset.findBubbleRight(selection);
            nodeBubble && select.uniq(nodeBubble);
        }

    } else {
        const nodeEditor = sharedData.nodeEditor;
        const list = select.get(nodeEditor);
        const begin = do {
            if (list.length > 1 && list[ list.length - 1 ] === nodeEditor.startRangeSelect) {
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

        // } else if (begin && begin.nextSibling && begin.nextSibling.nodeType === Node.TEXT_NODE) {
        //     select.clear(nodeEditor);
        //     selection.collapse(begin.nextSibling, 0);

        } else {
            cursor.restore(nodeEditor);
        }
    }
}

function removeBubbles(nodeEditor, removeFromRight = false) {
    const list = select.get(nodeEditor);
    if (!list.length) {
        return false;
    }

    let firstBubble = list[ 0 ].previousSibling;
    let secondBubble = list[ list.length - 1 ].nextSibling;

    if (removeFromRight) {
        let _ = firstBubble;
        firstBubble = secondBubble;
        secondBubble = _;
    }

    bubbleset.removeBubbles(nodeEditor, list);

    if (bubble.isBubbleNode(firstBubble)) {
        select.uniq(firstBubble);

    } else if (bubble.isBubbleNode(secondBubble)) {
        select.uniq(secondBubble);

    } else {
        nodeEditor.focus();
        // без задержки не восстанавливает курсор
        raf(() => cursor.restore(nodeEditor));
    }

    nodeEditor.fireChange();
    return true;
}

function copyBubbles(nodeEditor, callback = function () {}) {
    const selection = utils.getSelection(nodeEditor);
    if (selection) {
        return false;
    }

    const list = select.get(nodeEditor);
    if (!list.length) {
        return false;
    }

    const bubbleCopy = nodeEditor.options('bubbleCopy');
    const value = bubbleCopy(list);

    if (!value) {
        return false;
    }

    nodeEditor[ PROPS.LOCK_COPY ] = true;

    const target = nodeEditor.ownerDocument.createElement('input');
    target.value = value;
    target.style.cssText = `
        position: absolute;
        left: -9999px;
        width: 1px;
        height: 1px;
        margin: 0;
        padding: 0;
        border: none;`;

    nodeEditor.parentNode.appendChild(target);

    events.one(target, {
        keyup: () => nodeEditor.focus(),
        blur: () => {
            target && target.parentNode && target.parentNode.removeChild(target);
            raf(callback);
        }
    });

    target.select();
    return true;
}
