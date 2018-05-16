const events = require('../events');
const bubbleset = require('../bubbleset');
const { PROPS } = require('../constant');

/**
 * @param {Event} event
 * @param {Object} sharedData
 * @param {HTMLElement} [sharedData.nodeEditor]
 * @param {HTMLElement} [sharedData.nodeBubble]
 * @param {boolean} [sharedData.isDblclick]
 * @returns {?boolean}
 */
module.exports = function (event, sharedData) {
    const nodeEditor = bubbleset.closestNodeSet(event.target);
    if (!nodeEditor) {
        return events.prevent(event);
    }

    sharedData.nodeEditor = nodeEditor;
    sharedData.nodeBubble = bubbleset.closestNodeBubble(event.target);
    sharedData.isDblclick = false;
    sharedData.canAddBubble = nodeEditor.canAddBubble();

    if (sharedData.nodeBubble) {
        const clickTime = Date.now();
        sharedData.isDblclick = nodeEditor[ PROPS.CLICK_TIME ] && (clickTime - nodeEditor[ PROPS.CLICK_TIME ]) < 200;

        nodeEditor[ PROPS.CLICK_TIME ] = clickTime;
    }
};
