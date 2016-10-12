const bubble = require('./bubble');
const zws = require('./zws');
const context = require('../context');

exports.findNode = function (node) {
    while (node) {
        if (node.nodeType === Node.ELEMENT_NODE &&
            node.getAttribute('is') === 'x-bubbles') {

            return node;
        }

        node = node.parentNode;
    }
};

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
