const bubbleset = require('../bubbleset');
const select = require('../select');
const cursor = require('../cursor');

module.exports = function (event) {
    const nodeSet = bubbleset.closestNodeSet(event.target);

    if (!nodeSet) {
        return;
    }

    const nodeBubble = bubbleset.closestNodeBubble(event.target);

    if (!nodeBubble) {
        select.clear(nodeSet);
        cursor.restore(nodeSet);
        return;
    }

    if (event.metaKey) {
        select.add(nodeBubble);

    } else if (event.shiftKey) {
        if (!nodeSet.startRangeSelect) {
            select.uniq(nodeBubble);

        } else {
            select.range(nodeBubble);
        }

    } else {
        select.toggleUniq(nodeBubble);
    }
};
