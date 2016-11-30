const bubble = require('../bubble');

/**
 * @param {Event} event
 */
module.exports = function (event) {
    bubble.bubbling(event.currentTarget);
};
