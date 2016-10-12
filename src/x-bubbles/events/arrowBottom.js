const select = require('../select');
const cursor = require('../cursor');

module.exports = function (event) {
    const nodeSet = event.currentTarget;

    if (select.has(nodeSet)) {
        event.preventDefault();
        cursor.restore(nodeSet);
    }
};
