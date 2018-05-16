const cursor = require('../cursor');

/**
 * @param {Event} event
 */
module.exports = function (event) {
    const nodeEditor = event.currentTarget;
    cursor.restore(nodeEditor);
};
