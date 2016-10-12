const cursor = require('../cursor');
const bubbleset = require('../bubbleset');

module.exports = function (event) {
    const nodeSet = bubbleset.closestNodeSet(event.currentTarget);

    if (!nodeSet) {
        return;
    }

    cursor.restore(nodeSet);
};
