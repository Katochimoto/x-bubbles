const bubble = require('../bubble');
const select = require('../select');
const zws = require('../zws');

module.exports = function (event) {
    const set = event.currentTarget;
    const list = select.get(set);

    if (!list.length) {
        moveTextCursorLeft(window.getSelection());
        return;
    }

    const begin = do {
        if (list.length > 1 && list[0] === set.startRangeSelect) {
            list[ list.length - 1 ];
        } else {
            list[0];
        }
    };

    const node = getPrevBubble(begin);
    if (!node) {
        return;
    }

    if (event.shiftKey) {
        select.range(node);

    } else {
        select.uniq(node);
    }
};

function moveTextCursorLeft(sel) {
    if (!sel || !sel.isCollapsed || !sel.anchorNode) {
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
