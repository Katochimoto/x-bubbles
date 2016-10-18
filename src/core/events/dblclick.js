const bubbleset = require('../bubbleset');
const bubble = require('../bubble');

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

    bubble.edit(nodeSet, nodeBubble);
};
