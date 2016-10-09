const bubble = require('../bubble');
const cursor = require('../cursor');
const zws = require('../zws');

module.exports = function (event) {
    if (bubble.isBubbleNode(event.target)) {
        const node = getNextBubble(event.target);
        if (node) {
            node.focus();

        } else {
            cursor.restore(event.currentTarget);
        }

        return;
    }

    const sel = window.getSelection();
    moveTextCursorRight(sel);
};

function moveTextCursorRight(sel) {
    if (!sel || !sel.isCollapsed) {
        return;
    }

    if (sel.anchorNode.nodeType !== Node.TEXT_NODE) {
        return;
    }

    const len = sel.anchorNode.nodeValue.length;

    if (sel.anchorOffset === len) {
        const node = getNextBubble(sel.anchorNode);
        if (node) {
            node.focus();
        }

    } else {
        const zwsText = sel.anchorNode.nodeValue.substring(sel.anchorOffset, sel.anchorOffset + 1);
        if (zws.check(zwsText)) {
            sel.collapse(sel.anchorNode, sel.anchorOffset + 1);
            moveTextCursorRight(sel);
        }
    }
}

function getNextBubble(target) {
    let node = target.nextSibling;
    while (node) {
        if (bubble.isBubbleNode(node)) {
            return node;
        }

        node = node.nextSibling;
    }
}
