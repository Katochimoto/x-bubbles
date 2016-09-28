const zws = require('../zws');

module.exports = function (event) {
    const clipboardData = event.clipboardData;
    if (!clipboardData) {
        return;
    }

    let data = clipboardData.getData && clipboardData.getData('text/plain');

    if (!pasteString(data) && clipboardData.items) {
        Array.prototype.slice.call(clipboardData.items)
            .filter(item => item.kind === 'string' && item.type === 'text/plain')
            .some(function (item) {
                item.getAsString(pasteString);
                return true;
            });
    }
};

function pasteString(data) {
    data = zws.textClean(String(data || '').trim());

    if (!data) {
        return false;
    }

    const sel = window.getSelection();
    const anchor = document.createElement('span');
    const text = document.createTextNode(data);

    sel.getRangeAt(0).surroundContents(anchor);
    anchor.parentNode.replaceChild(text, anchor);
    sel.removeAllRanges();
    sel.collapse(text, text.nodeValue.length);

    return true;
}
