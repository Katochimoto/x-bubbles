const bubble = require('../bubble');
const select = require('../select');
const zws = require('../zws');

module.exports = function (event) {
    const head = select.head(event.currentTarget);

    if (head) {
        const node = getPrevBubble(head);
        if (node) {
            select.uniq(node);
        }

        return;
    }

    moveTextCursorLeft(window.getSelection());
};

function moveTextCursorLeft(sel) {
    if (!sel || !sel.isCollapsed) {
        return;
    }

    if (sel.anchorNode.nodeType !== Node.TEXT_NODE) {
        return;
    }

    if (sel.anchorOffset === 0) {
        const node = getPrevBubble(sel.anchorNode);
        if (node) {
            select.uniq(node);
        }

    } else {
        const zwsText = sel.anchorNode.nodeValue.substring(sel.anchorOffset - 1, sel.anchorOffset);
        if (zws.check(zwsText)) {
            sel.collapse(sel.anchorNode, sel.anchorOffset - 1);
            moveTextCursorLeft(sel);
        }
    }
}

function getPrevBubble(target) {
    let node = target && target.previousSibling;
    while (node) {
        if (bubble.isBubbleNode(node)) {
            return node;
        }

        node = node.previousSibling;
    }
}
