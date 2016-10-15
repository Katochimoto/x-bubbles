const bubble = require('./bubble');
const text = require('./text');
const context = require('../context');

const slice = Array.prototype.slice;

exports.lastBubble = function (nodeSet) {
    return nodeSet.querySelector('[bubble]:last-child');
};

exports.headBubble = function (nodeSet) {
    return nodeSet.querySelector('[bubble]:first-child');
};

exports.getBubbles = function (nodeSet) {
    return slice.call(nodeSet.querySelectorAll('[bubble]'));
};

exports.hasBubbles = function (nodeSet) {
    return Boolean(nodeSet.querySelector('[bubble]'));
};

exports.closestNodeSet = closestNodeSet;
exports.closestNodeBubble = closestNodeBubble;
exports.prevBubble = prevBubble;
exports.nextBubble = nextBubble;

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

        if (node.nodeType === Node.TEXT_NODE && text.textClean(node.nodeValue)) {
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
        if (bubble.isBubbleNode(node)) {
            return node;
        }

        node = node.parentNode;
    }
}

function prevBubble(target) {
    let node = target && target.previousSibling;
    while (node) {
        if (bubble.isBubbleNode(node)) {
            return node;
        }

        node = node.previousSibling;
    }
}

function nextBubble(target) {
    let node = target && target.nextSibling;
    while (node) {
        if (bubble.isBubbleNode(node)) {
            return node;
        }

        node = node.nextSibling;
    }
}
