const context = require('../context');
const zws = require('./zws');
const select = require('./select');

exports.restore = function (node) {
    select.clear(node);
    let fakeText = zws.createElement();

    if (node.hasChildNodes()) {
        const lastNode = node.childNodes[ node.childNodes.length - 1 ];

        if (lastNode.isEqualNode(fakeText)) {
            fakeText = lastNode;

        } else {
            node.appendChild(fakeText);
        }

    } else {
        node.appendChild(fakeText);
    }

    const sel = context.getSelection();
    sel.removeAllRanges();
    sel.collapse(fakeText, 1);
};
