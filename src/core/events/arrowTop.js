const bubbleset = require('../bubbleset');
const select = require('../select');

module.exports = function (event) {
    const nodeSet = bubbleset.closestNodeSet(event.currentTarget);
    const headBubble = nodeSet && bubbleset.headBubble(nodeSet);

    if (headBubble) {
        select.uniq(headBubble);
    }
};
