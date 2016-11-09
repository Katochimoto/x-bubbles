const raf = require('raf');
const events = require('../events');
const select = require('../select');
const { PROPS } = require('../constant');
const utils = require('../utils');

module.exports = function (event, callback = function () {}) {
    const nodeEditor = event.target;
    const selection = utils.getSelection(nodeEditor);

    if (selection) {
        return false;
    }

    const doc = nodeEditor.ownerDocument;
    const list = select.get(nodeEditor);

    if (!list.length) {
        return false;
    }

    const bubbleCopy = nodeEditor.options('bubbleCopy');
    const value = bubbleCopy(list);

    if (!value) {
        return false;
    }

    nodeEditor[ PROPS.LOCK_COPY ] = true;

    const target = doc.createElement('input');
    target.value = value;
    target.style.cssText = `
        position: absolute;
        top: -9999px;
        width: 1px;
        height: 1px;
        margin: 0;
        padding: 0;
        border: none;`;

    doc.body.appendChild(target);

    events.one(target, 'keyup', function () {
        nodeEditor.focus();
    });

    events.one(nodeEditor, 'focusin', function () {
        removeNode(target);
        raf(callback);
    });

    target.select();
    return true;
};

function removeNode(node) {
    node && node.parentNode && node.parentNode.removeChild(node);
}
