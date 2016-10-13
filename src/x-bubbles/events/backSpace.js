const context = require('../../context');
const bubble = require('../bubble');
const cursor = require('../cursor');
const select = require('../select');
const text = require('../text');
const bubbleset = require('../bubbleset');

module.exports = function (event) {
    event.preventDefault();

    const nodeSet = bubbleset.closestNodeSet(event.currentTarget);

    if (!nodeSet) {
        return;
    }

    nodeSet.normalize();

    const selection = context.getSelection();
    if (!selection) {
        return;
    }

    if (selection.isCollapsed) {
        if (text.arrowLeft(selection, true)) {
            text.remove(selection);
            nodeSet.fireInput();
            return;
        }

    } else {
        text.remove(selection);
        nodeSet.fireInput();
        return;
    }

    let node = bubbleset.findBubbleLeft(selection);
    if (node) {
        select.uniq(node);
        return;
    }

    const list = select.get(nodeSet);

    if (list.length) {
        const prevBubble = list[ 0 ].previousSibling;
        const nextBubble = list[ list.length - 1 ].nextSibling;
        list.forEach(item => item.parentNode.removeChild(item));

        if (bubble.isBubbleNode(prevBubble)) {
            select.uniq(prevBubble);

        } else if (bubble.isBubbleNode(nextBubble)) {
            select.uniq(nextBubble);

        } else {
            nodeSet.focus();
            cursor.restore(nodeSet);
            nodeSet.fireChange();
        }
    }
};
