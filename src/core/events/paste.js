const context = require('../../context');
const zws = require('../zws');

const slice = Array.prototype.slice;

module.exports = function (event) {
    event.preventDefault();

    const clipboardData = event.clipboardData;

    if (!clipboardData) {
        return;
    }

    let data = clipboardData.getData && clipboardData.getData('text/plain');

    if (!pasteString(data) && clipboardData.items) {
        slice.call(clipboardData.items)
            .filter(item => item.kind === 'string' && item.type === 'text/plain')
            .some(function (item) {
                item.getAsString(pasteString);
                return true;
            });
    }
};

function pasteString(data) {
    data = zws.textClean(data);
    if (!data) {
        return false;
    }

    const selection = context.getSelection();
    if (!selection || !selection.rangeCount) {
        return false;
    }

    const anchor = document.createElement('span');
    const textNode = document.createTextNode(data);

    selection.getRangeAt(0).surroundContents(anchor);
    anchor.parentNode.replaceChild(textNode, anchor);
    selection.removeAllRanges();
    selection.collapse(textNode, textNode.nodeValue.length);

    return true;
}
