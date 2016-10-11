const select = require('../select');
const cursor = require('../cursor');

module.exports = function (event) {
    const set = event.currentTarget;
    if (select.has(set)) {
        event.preventDefault();
        cursor.restore(set);
    }
};
