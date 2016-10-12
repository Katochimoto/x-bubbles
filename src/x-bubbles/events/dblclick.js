const context = require('../../context');
const zws = require('../zws');
const bubbleset = require('../bubbleset');

module.exports = function (event) {
    const nodeSet = bubbleset.closestNodeSet(event.target);

    if (!nodeSet) {
        return;
    }

    const nodeBubble = bubbleset.closestNodeBubble(event.target);

    if (!nodeBubble) {
        return;
    }

    event.preventDefault();

    const fakeText = zws.createElement();
    const text = document.createTextNode(zws.textClean(nodeBubble.innerText));

    nodeSet.replaceChild(text, nodeBubble);
    nodeSet.insertBefore(fakeText, text);

    const selection = context.getSelection();

    if (selection) {
        const range = document.createRange();
        range.setStartBefore(fakeText);
        range.setEndAfter(text);

        selection.removeAllRanges();
        selection.addRange(range);
    }
};
