const zws = require('./zws');

exports.restore = function (node) {
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

    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.collapse(fakeText, 1);
};
