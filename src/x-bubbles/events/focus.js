const cursor = require('../cursor');
const select = require('../select');

module.exports = function (event) {
    select.clear(event.currentTarget);
    cursor.restore(event.currentTarget);
};
