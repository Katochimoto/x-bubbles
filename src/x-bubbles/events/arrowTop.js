const bubbleset = require('../bubbleset');
const select = require('../select');

module.exports = function (event) {
    event.preventDefault();

    const nodeSet = bubbleset.findNode(event.currentTarget);
    const headBubble = bubbleset.headBubble(nodeSet);

    if (headBubble) {
        select.uniq(headBubble);
    }
};
