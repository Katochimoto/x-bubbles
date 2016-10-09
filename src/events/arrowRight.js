const bubble = require('../bubble');
const cursor = require('../cursor');
const select = require('../select');
const zws = require('../zws');

module.exports = function (event) {
    const set = event.currentTarget;
    const last = select.head(set);

    if (!last) {
        moveTextCursorRight(window.getSelection());
        return;
    }

    const node = getNextBubble(last);

    if (node) {
        select.uniq(node);

    } else {
        const text = last.nextSibling;

        if (text && text.nodeType === Node.TEXT_NODE) {
            select.clear(set);

            const sel = window.getSelection();
            sel.collapse(text, 0);

        } else {
            cursor.restore(event.currentTarget);
        }
    }
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
            select.uniq(node);
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
    let node = target && target.nextSibling;
    while (node) {
        if (bubble.isBubbleNode(node)) {
            return node;
        }

        node = node.nextSibling;
    }
}
