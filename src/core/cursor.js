/**
 * @module x-bubbles/cursor
 */

const context = require('../context');
const text = require('./text');
const select = require('./select');
const utils = require('./utils');

exports.restore = restore;
exports.restoreBasis = restoreBasis;

/**
 * Reset the cursor position to the end of the input field.
 * This action is forbidden in the IE Mobile because it
 * causes a browser crash. There is still no workaround.
 * @alias module:x-bubbles/cursor.restore
 * @param {HTMLElement} nodeSet
 */
function restore(nodeSet) {
    if (!utils.isMobileIE) {
        select.clear(nodeSet);
        const basis = restoreBasis(nodeSet);
        const selection = context.getSelection();
        selection.removeAllRanges();
        selection.collapse(basis, 1);
    }
}

/**
 * The creation of the fake text at the end childNodes
 * @alias module:x-bubbles/cursor.restoreBasis
 * @param {HTMLElement} nodeSet
 * @returns {HTMLTextElement} fake text node
 */
function restoreBasis(nodeSet) {
    let fakeText = text.createZws();

    if (nodeSet.hasChildNodes()) {
        const lastNode = nodeSet.childNodes[ nodeSet.childNodes.length - 1 ];

        if (lastNode.isEqualNode(fakeText)) {
            fakeText = lastNode;

        } else {
            nodeSet.appendChild(fakeText);
        }

    } else {
        nodeSet.appendChild(fakeText);
    }

    return fakeText;
}
