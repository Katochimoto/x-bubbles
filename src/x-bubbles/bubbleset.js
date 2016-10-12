const bubble = require('./bubble');
const zws = require('./zws');
const context = require('../context');

exports.lastBubble = function (nodeSet) {
    return nodeSet.querySelector('[bubble]:last-child');
};

exports.headBubble = function (nodeSet) {
    return nodeSet.querySelector('[bubble]:first-child');
};

exports.closestNodeSet = closestNodeSet;
exports.closestNodeBubble = closestNodeBubble;

exports.findBubbleLeft = function (selection) {
    selection = selection || context.getSelection();

    if (!selection || !selection.focusNode) {
        return;
    }

    let node = selection.focusNode.previousSibling;

    while (node) {
        if (bubble.isBubbleNode(node)) {
            return node;
        }

        if (node.nodeType === Node.TEXT_NODE && zws.textClean(node.nodeValue)) {
            return;
        }

        node = node.previousSibling;
    }
};

function closestNodeSet(node) {
    while (node) {
        if (node.nodeType === Node.ELEMENT_NODE &&
            node.getAttribute('is') === 'x-bubbles') {

            return node;
        }

        node = node.parentNode;
    }
}

function closestNodeBubble(node) {
    while (node) {
        if (node.nodeType === Node.ELEMENT_NODE &&
            node.hasAttribute('bubble')) {

            return node;
        }

        node = node.parentNode;
    }
}
