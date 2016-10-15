const cursor = require('../cursor');

module.exports = function (event) {
    cursor.restore(event.currentTarget);
};
