const events = require('../events');
const { KEY } = require('../constant');

/**
 * @param {Event} event
 */
module.exports = function (event) {
    const nodeEditor = event.currentTarget;
    const code = events.keyCode(event);
    const inputCharIsSpace = events.inputCharIsSpace(event);
    const isPrintableChar = do {
        if (event.key) {
            event.key.length === 1;

        } else {
            ((code > 47 || code === KEY.Space || inputCharIsSpace || code === KEY.Backspace) && code !== KEY.Cmd);
        }
    };

    if (isPrintableChar) {
        nodeEditor.fireInput();
    }
};
