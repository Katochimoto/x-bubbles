const cursor = require('../cursor');

/**
 * @param {Event} event
 */
module.exports = function (event) {
    cursor.restore(event.currentTarget);
};
