const events = require('../events');
const { PROPS } = require('../constant');

/**
 * @param {Event} event
 * @returns {?boolean}
 */
module.exports = function (event) {
    if (event.currentTarget[ PROPS.LOCK_COPY ]) {
        return events.prevent(event);
    }
};
