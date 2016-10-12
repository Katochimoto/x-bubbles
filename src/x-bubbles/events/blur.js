const bubbleset = require('../bubbleset');
const bubble = require('../bubble');
const select = require('../select');

module.exports = function (event) {
    const nodeSet = bubbleset.closestNodeSet(event.currentTarget);

    if (!nodeSet) {
        return;
    }

    bubble.bubbling(nodeSet);
    select.clear(nodeSet);
};
