const raf = require('raf');
const context = require('../../context');
const events = require('../events');
const { PROPS } = require('../constant');

/**
 * @param {Event} event
 * @returns {?boolean}
 */
module.exports = function (event) {
    const nodeEditor = event.currentTarget;
    if (nodeEditor[ PROPS.LOCK_COPY ]) {
        events.prevent(event);
        delete nodeEditor[ PROPS.LOCK_COPY ];

        // Safary 10 не сбрасывает курсор без задержки
        raf(() => {
            const selection = context.getSelection();
            selection && selection.removeAllRanges();
        });

        return false;
    }
};
