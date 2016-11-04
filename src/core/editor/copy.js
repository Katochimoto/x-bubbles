const events = require('../events');
const select = require('../select');

module.exports = function (nodeSet) {
    const selection = nodeSet.ownerDocument.defaultView.getSelection();
    if (selection && selection.anchorNode) {
        return;
    }

    const list = select.get(nodeSet);
    if (!list.length) {
        return;
    }

    const bubbleCopy = nodeSet.options('bubbleCopy');
    const value = bubbleCopy(list);
    if (!value) {
        return;
    }

    nodeSet._lockCopy = true;

    const target = nodeSet.ownerDocument.createElement('input');
    target.value = value;
    target.style.cssText = `
        position: absolute;
        top: -9999px;
        width: 1px;
        height: 1px;
        margin: 0;
        padding: 0;
        border: none;`;

    nodeSet.ownerDocument.body.appendChild(target);

    events.one(target, {
        blur: () => removeNode(target),
        keyup: () => {
            nodeSet.focus();
            removeNode(target);
        }
    });

    target.select();
};

function removeNode(node) {
    node.parentNode && node.parentNode.removeChild(node);
}
