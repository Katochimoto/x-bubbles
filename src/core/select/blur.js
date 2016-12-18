const select = require('../select');

/**
 * @param {Event} event
 */
module.exports = function (event) {
    select.clear(event.currentTarget);
};
