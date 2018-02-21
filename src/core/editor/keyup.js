const events = require('../events');
const { KEY } = require('../constant');

/**
 * @param {Event} event
 */
module.exports = function (event) {
    const nodeEditor = event.currentTarget;
    const code = events.keyCode(event);
    const isPrintableChar = do {
        if (event.key) {
            event.key.length === 1;

        } else {
            ((code > 47 || code === KEY.Space || code === KEY.Backspace) && code !== KEY.Cmd);
        }
    };

    if (isPrintableChar && nodeEditor.canAddBubble()) {
        nodeEditor.fireInput();
    }
};
