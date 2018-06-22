const raf = require('raf');
const cursor = require('../cursor');
const context = require('../../context');

/**
 * @param {Event} event
 */
module.exports = function (event) {
    const nodeEditor = event.currentTarget;

    // Don't show cursor if can't add bubble
    if (!nodeEditor.canAddBubble()) {
        // Safary 10 не сбрасывает курсор без задержки
        raf(() => {
            const selection = context.getSelection();
            selection && selection.removeAllRanges();
        });
    }

    cursor.restore(nodeEditor);
};
