const events = require('../events');
const bubble = require('../bubble');
const select = require('../select');
const { KEY } = require('../constant');

/**
 * @param {Event} event
 * @param {Object} sharedData
 */
module.exports = function (event, sharedData) {
    const code = events.keyCode(event);
    const nodeEditor = event.currentTarget;

    if (code === KEY.Enter) {
        event.preventDefault();
        if (!nodeEditor.options('disableControls') && !sharedData.enterBubbling) {
            editBubbleKeyboardEvent(nodeEditor);
        }

    } else if (code === KEY.Space) {
        if (editBubbleKeyboardEvent(nodeEditor)) {
            event.preventDefault();
        }
    }
};

function editBubbleKeyboardEvent(nodeEditor) {
    const editableBubble = select.getEditable(nodeEditor);

    if (editableBubble) {
        return bubble.edit(nodeEditor, editableBubble);
    }

    return false;
}
