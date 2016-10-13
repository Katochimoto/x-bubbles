const bubbleset = require('../bubbleset');
const bubble = require('../bubble');
const cursor = require('../cursor');

module.exports = function (event) {
    const code = event.charCode || event.keyCode;

    /* eslint no-case-declarations: 0 */
    switch (code) {
    case 13: // Enter
    case 44: // ,
    case 59: // ;
        event.preventDefault();

        const nodeSet = bubbleset.closestNodeSet(event.currentTarget);
        if (!nodeSet) {
            return;
        }

        bubble.bubbling(nodeSet);
        cursor.restore(nodeSet);
        break;
    }
};
