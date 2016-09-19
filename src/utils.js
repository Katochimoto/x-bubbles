const zws = require('./zws');

exports.restoreCursor = function (node) {
    var fakeText = zws.createElement();

    if (node.hasChildNodes()) {
        var lastNode = node.childNodes[ node.childNodes.length - 1 ];

        if (lastNode.isEqualNode(fakeText)) {
            fakeText = lastNode;

        } else {
            node.appendChild(fakeText);
        }

    } else {
        node.appendChild(fakeText);
    }

    var sel = window.getSelection();
    sel.removeAllRanges();
    sel.collapse(fakeText, 1);
};
