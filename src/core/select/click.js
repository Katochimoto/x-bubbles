const events = require('../events');
const select = require('../select');

/**
 * @param {Event} event
 * @param {Object} sharedData
 * @param {HTMLElement} sharedData.nodeEditor
 * @param {HTMLElement} [sharedData.nodeBubble]
 * @param {boolean} sharedData.isDblclick
 */
module.exports = function (event, sharedData) {
    const nodeEditor = sharedData.nodeEditor;
    const nodeBubble = sharedData.nodeBubble;
    const isDblclick = sharedData.isDblclick;

    if (nodeBubble) {
        if (events.metaKey(event)) {
            select.add(nodeBubble);

        } else if (event.shiftKey) {
            if (!nodeEditor.startRangeSelect) {
                select.uniq(nodeBubble);

            } else {
                select.range(nodeBubble);
            }

        } else if (!isDblclick) {
            select.toggleUniq(nodeBubble);
        }

    } else {
        select.clear(nodeEditor);
    }
};
