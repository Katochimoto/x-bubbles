const events = require('../events');
const bubble = require('../bubble');
const cursor = require('../cursor');
const utils = require('../utils');

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
        if (isDblclick) {
            if (!event.shiftKey && !events.metaKey(event)) {
                bubble.edit(nodeEditor, nodeBubble);
            }

        } else if (!nodeEditor.options('selection')) {
            bubble.bubbling(nodeEditor);
            cursor.restore(nodeEditor);
        }
    } else {
        const selection = utils.getSelection(nodeEditor);

        if (!selection || selection.anchorNode.nodeType !== Node.TEXT_NODE) {
            cursor.restore(nodeEditor);
        }
    }
};
