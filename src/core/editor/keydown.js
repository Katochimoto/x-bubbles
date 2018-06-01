const events = require('../events');
const bubble = require('../bubble');
const cursor = require('../cursor');
const text = require('../text');
const bubbleset = require('../bubbleset');
const { KEY } = require('../constant');

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
    case KEY.Esc:
        event.preventDefault();
        bubble.bubbling(sharedData.nodeEditor);
        cursor.restore(sharedData.nodeEditor);
        break;

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

    case KEY.Home:
        if (event.shiftKey) {
            event.preventDefault();
            sharedData.isTextSelectedFromBeginToCursor = text.selectFromCursorToStrBegin(null, sharedData.nodeEditor);
        }
        break;

    case KEY.a:
        if (metaKey) {
            event.preventDefault();
            sharedData.isTextSelectAll = text.selectAll(null, sharedData.nodeEditor);
        }
        break;
    }
};

/**
 * @param {Event} event
 * @param {Object} sharedData
 * @param {boolean} [sharedData.isEmptyLeft]
 * @param {Selection} [sharedData.selection]
 * @param {HTMLElement} [sharedData.nodeEditor]
 */
function onBackspace(event, sharedData) {
    const selection = sharedData.selection;
    if (!selection) {
        return;
    }

    const nodeEditor = sharedData.nodeEditor;

    if (!selection.isCollapsed || text.arrowLeft(selection, true)) {
        text.remove(selection);
        nodeEditor.fireInput();

        // Если после удаления больше нет текста, то, возможно,
        // удалили какой-то бабл во время его редактирования.
        // Нужно оповестить о изменениях
        if (!text.hasNear(selection)) {
            nodeEditor.fireChange();
        }

    } else if (!nodeEditor.options('selection')) {
        const nodeBubble = bubbleset.findBubbleLeft(selection);

        if (nodeBubble) {
            bubbleset.removeBubbles(nodeEditor, [ nodeBubble ]);
            nodeEditor.fireChange();
        }

    } else {
        sharedData.isEmptyLeft = true;
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
    const selection = sharedData.selection;
    if (!selection) {
        return;
    }

    const nodeEditor = sharedData.nodeEditor;

    if (!selection.isCollapsed || text.arrowRight(selection, true)) {
        text.remove(selection);
        nodeEditor.fireInput();

        // Если после удаления больше нет текста, то, возможно,
        // удалили какой-то бабл во время его редактирования.
        // Нужно оповестить о изменениях
        if (!text.hasNear(selection)) {
            nodeEditor.fireChange();
        }

    } else if (!nodeEditor.options('selection')) {
        const nodeBubble = bubbleset.findBubbleRight(selection);

        if (nodeBubble) {
            bubbleset.removeBubbles(nodeEditor, [ nodeBubble ]);
            nodeEditor.fireChange();
        }

    } else {
        sharedData.isEmptyRight = true;
    }
}

/**
 * @param {Event} event
 * @param {Object} sharedData
 * @param {boolean} [sharedData.isEmptyLeft]
 * @param {Selection} [sharedData.selection]
 */
function onArrowLeft(event, sharedData) {
    sharedData.isEmptyLeft = !text.arrowLeft(sharedData.selection, event.shiftKey);
}

/**
 * @param {Event} event
 * @param {Object} sharedData
 * @param {boolean} [sharedData.isEmptyRight]
 * @param {Selection} [sharedData.selection]
 */
function onArrowRight(event, sharedData) {
    sharedData.isEmptyRight = !text.arrowRight(sharedData.selection, event.shiftKey);
}
