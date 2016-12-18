const utils = require('../utils');
const events = require('../events');
const { KEY } = require('../constant');

/**
 * @param {Event} event
 * @param {Object} sharedData
 * @param {Selection} [sharedData.selection]
 * @param {HTMLElement} [sharedData.nodeEditor]
 */
module.exports = function (event, sharedData) {
    const code = events.keyCode(event);
    sharedData.nodeEditor = event.currentTarget;

    switch (code) {
    case KEY.Left:
    case KEY.Right:
    case KEY.Delete:
    case KEY.Backspace:
        event.preventDefault();
        sharedData.selection = utils.getSelection(event.currentTarget);
        break;
    }
};
