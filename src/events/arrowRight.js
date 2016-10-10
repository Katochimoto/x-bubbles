const bubble = require('../bubble');
const cursor = require('../cursor');
const select = require('../select');
const zws = require('../zws');

module.exports = function (event) {
    const set = event.currentTarget;
    const list = select.get(set);

    if (!list.length) {
        moveTextCursorRight(window.getSelection());
        return;
    }

    const begin = do {
        if (list.length > 1 && list[ list.length - 1 ] === set.startRangeSelect) {
            list[0];
        } else {
            list[ list.length - 1 ];
        }
    };

    const node = getNextBubble(begin);

    if (node) {
        if (event.shiftKey) {
            select.range(node);

        } else {
            select.uniq(node);
        }

    } else {
        cursor.restore(set);
    }
};

function moveTextCursorRight(sel) {
    if (!sel || !sel.isCollapsed || !sel.anchorNode) {
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
