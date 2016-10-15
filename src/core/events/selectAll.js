const context = require('../../context');
const zws = require('../zws');

module.exports = function (event) {
    const nodeSet = event.currentTarget;
    const selection = context.getSelection();
    const node = selection && selection.anchorNode;
    const hasBubble = Boolean(nodeSet.querySelector('[bubble]'));

    if (node && node.nodeType === Node.TEXT_NODE) {
        let fromNode;
        let toNode;
        let item = node;

        while (item && item.nodeType === Node.TEXT_NODE) {
            fromNode = item;
            item = item.previousSibling;
        }

        item = node;

        while (item && item.nodeType === Node.TEXT_NODE) {
            toNode = item;
            item = item.nextSibling;
        }

        const range = document.createRange();
        range.setStartBefore(fromNode);
        range.setEndAfter(toNode);

        const text = zws.textClean(range.toString());

        if (text || (!text && !hasBubble)) {
            if (!text) {
                range.collapse();
            }

            selection.removeAllRanges();
            selection.addRange(range);
            return true;
        }
    }

    return false;
};
