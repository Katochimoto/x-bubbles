const events = require('../events');
const utils = require('../utils');
const bubble = require('../bubble');
const select = require('../select');
const { KEY } = require('../constant');

/**
 * @param {Event} event
 */
module.exports = function (event) {
    const code = events.keyCode(event);
    const inputCharIsSpace = events.inputCharIsSpace(event);
    const nodeEditor = event.currentTarget;

    if (code === KEY.Enter) {
        event.preventDefault();
        if (!nodeEditor.options('disableControls')) {
            editBubbleKeyboardEvent(nodeEditor);
        }

    } else if (code === KEY.Space || inputCharIsSpace) {
        if (editBubbleKeyboardEvent(nodeEditor)) {
            event.preventDefault();
        }
    }
};

function editBubbleKeyboardEvent(nodeEditor) {
    const selection = utils.getSelection(nodeEditor);

    if (!selection || !selection.rangeCount) {
        const list = select.get(nodeEditor);

        if (list.length === 1) {
            return bubble.edit(nodeEditor, list[0]);
        }
    }

    return false;
}
