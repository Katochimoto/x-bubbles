const events = require('../events');
const select = require('../select');
const { PROPS } = require('../constant');

module.exports = function (event) {
    const nodeEditor = event.currentTarget;
    const doc = nodeEditor.ownerDocument;
    const selection = doc.defaultView.getSelection();

    if (selection && selection.anchorNode) {
        return;
    }

    const list = select.get(nodeEditor);
    if (!list.length) {
        return;
    }

    const bubbleCopy = nodeEditor.options('bubbleCopy');
    const value = bubbleCopy(list);
    if (!value) {
        return;
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

    events.one(target, {
        blur: () => removeNode(target),
        keyup: () => {
            nodeEditor.focus();
            removeNode(target);
        }
    });

    target.select();
};

function removeNode(node) {
    node.parentNode && node.parentNode.removeChild(node);
}
