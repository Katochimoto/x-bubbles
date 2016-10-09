const bubble = require('../bubble');
const zws = require('../zws');

module.exports = function (event) {
    if (bubble.isBubbleNode(event.target)) {
        const node = getPrevBubble(event.target);
        if (node) {
            node.focus();
        }

        return;
    }

    const sel = window.getSelection();
    moveTextCursorLeft(sel);
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
            node.focus();
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
    let node = target.previousSibling;
    while (node) {
        if (bubble.isBubbleNode(node)) {
            return node;
        }

        node = node.previousSibling;
    }
}
