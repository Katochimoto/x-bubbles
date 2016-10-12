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

    const sel = context.getSelection();
    if (!sel || !sel.rangeCount) {
        return false;
    }

    const anchor = document.createElement('span');
    const text = document.createTextNode(data);

    sel.getRangeAt(0).surroundContents(anchor);
    anchor.parentNode.replaceChild(text, anchor);
    sel.removeAllRanges();
    sel.collapse(text, text.nodeValue.length);

    return true;
}
