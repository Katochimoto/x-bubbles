const raf = require('raf');
const select = require('../select');
const text = require('../text');
const bubbleset = require('../bubbleset');
const bubble = require('../bubble');
const cursor = require('../cursor');
const utils = require('../utils');

/**
 * Реакция на событие нажатия на кнопку Delete.
 * Нельзя выполнять normalize() перед выполнением, иначе в ИЕ сбивается Selection.
 * @param {KeyboardEvent} event
 */
module.exports = function (event) {
    const nodeEditor = event.target;
    const selection = utils.getSelection(nodeEditor);

    if (selection) {
        if (!selection.isCollapsed) {
            text.remove(selection);
            nodeEditor.fireInput();

        } else if (text.arrowRight(selection, true)) {
            text.remove(selection);
            nodeEditor.fireInput();

        } else {
            const nodeBubble = bubbleset.findBubbleRight(selection);
            nodeBubble && select.uniq(nodeBubble);
        }

    } else if (!removeBubbles(nodeEditor)) {
        nodeEditor.focus();
        // без задержки не восстанавливает курсор
        raf(() => cursor.restore(nodeEditor));
    }
};

function removeBubbles(nodeEditor) {
    const list = select.get(nodeEditor);
    if (!list.length) {
        return false;
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
        // без задержки не восстанавливает курсор
        raf(() => cursor.restore(nodeEditor));
    }

    nodeEditor.fireChange();
    return true;
}
