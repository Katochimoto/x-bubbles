const context = require('../context');
const zws = require('./zws');
// const select = require('./select');

exports.restore = restore;
exports.restoreBasis = restoreBasis;

function restore(nodeSet) {
    // select.clear(nodeSet);
    const basis = restoreBasis(nodeSet);
    const selection = context.getSelection();
    selection.removeAllRanges();
    selection.collapse(basis, 1);
}

function restoreBasis(nodeSet) {
    let fakeText = zws.createElement();

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
