const bubble = require('./bubble');
const text = require('./text');

exports.closestNodeBubble = closestNodeBubble;
exports.closestNodeSet = closestNodeSet;
exports.findBubbleLeft = findBubbleLeft;
exports.findBubbleRight = findBubbleRight;
exports.getBubbles = getBubbles;
exports.hasBubbles = hasBubbles;
exports.headBubble = headBubble;
exports.lastBubble = lastBubble;
exports.nextBubble = nextBubble;
exports.prevBubble = prevBubble;

function lastBubble(nodeSet) {
    return nodeSet.querySelector('[bubble]:last-child');
}

function headBubble(nodeSet) {
    return nodeSet.querySelector('[bubble]:first-child');
}

function getBubbles(nodeSet) {
    return Array.prototype.slice.call(nodeSet.querySelectorAll('[bubble]'));
}

function hasBubbles(nodeSet) {
    return Boolean(nodeSet.querySelector('[bubble]'));
}

function findBubbleLeft(selection) {
    if (!selection.focusNode || !selection.anchorNode) {
        return;
    }

    let node = selection.focusNode.previousSibling;

    if (selection.anchorNode !== selection.focusNode &&
        selection.anchorNode.compareDocumentPosition(selection.focusNode) & Node.DOCUMENT_POSITION_FOLLOWING) {
        node = selection.anchorNode.previousSibling;
    }

    while (node) {
        if (bubble.isBubbleNode(node)) {
            return node;
        }

        if (node.nodeType === Node.TEXT_NODE && text.textClean(node.nodeValue)) {
            return;
        }

        node = node.previousSibling;
    }
}

function findBubbleRight(selection) {
    if (!selection.focusNode || !selection.anchorNode) {
        return;
    }

    let node = selection.focusNode.nextSibling;

    if (selection.anchorNode !== selection.focusNode &&
        selection.anchorNode.compareDocumentPosition(selection.focusNode) & Node.DOCUMENT_POSITION_FOLLOWING) {
        node = selection.anchorNode.nextSibling;
    }

    while (node) {
        if (bubble.isBubbleNode(node)) {
            return node;
        }

        if (node.nodeType === Node.TEXT_NODE && text.textClean(node.nodeValue)) {
            return;
        }

        node = node.nextSibling;
    }
}

function closestNodeSet(node) {
    while (node) {
        if (isEditorNode(node)) {
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

        if (isEditorNode(node)) {
            return;
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

function isEditorNode(node) {
    return (
        node.nodeType === Node.ELEMENT_NODE &&
        node.getAttribute('is') === 'x-bubbles'
    );
}
