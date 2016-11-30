const events = require('../events');
const bubble = require('../bubble');
const cursor = require('../cursor');
const { KEY } = require('../constant');

/**
 * @param {Event} event
 */
module.exports = function (event) {
    const code = events.keyCode(event);
    const nodeEditor = event.currentTarget;

    if (code === KEY.Enter) {
        event.preventDefault();
        if (!nodeEditor.options('disableControls')) {
            bubble.bubbling(nodeEditor);
            cursor.restore(nodeEditor);
        }

    } else {
        const separator = nodeEditor.options('separator');
        if (separator && separator.test(String.fromCharCode(code))) {
            event.preventDefault();
            bubble.bubbling(nodeEditor);
            cursor.restore(nodeEditor);
        }
    }
};
