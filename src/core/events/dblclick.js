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

    const selection = context.getSelection();

    if (!selection) {
        return;
    }

    event.preventDefault();

    const bubbleDeformation = nodeSet.options('bubbleDeformation');
    let rangeParams = bubbleDeformation(nodeBubble);

    if (!rangeParams) {
        const text = zws.textClean(nodeBubble.innerText);

        rangeParams = {
            text: text,
            startOffset: 0,
            endOffset: text.length
        };
    }

    const textFake = zws.createElement();
    const textNode = context.document.createTextNode(rangeParams.text);

    nodeSet.replaceChild(textNode, nodeBubble);
    nodeSet.insertBefore(textFake, textNode);

    const range = context.document.createRange();
    range.setStart(textNode, rangeParams.startOffset);
    range.setEnd(textNode, rangeParams.endOffset);

    selection.removeAllRanges();
    selection.addRange(range);
};
