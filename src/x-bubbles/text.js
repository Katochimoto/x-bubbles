const context = require('../context');
const zws = require('./zws');

exports.arrowRight = arrowRight;

function arrowRight(selection, append) {
    selection = selection || context.getSelection();

    if (!selection) {
        return false;
    }

    if (!selection.focusNode || selection.focusNode.nodeType !== Node.TEXT_NODE) {
        return false;
    }

    if (!selection.isCollapsed && !append) {
        let node = selection.focusNode;
        let offset = selection.focusOffset;

        if (selection.focusNode === selection.anchorNode) {
            offset = Math.max(selection.focusOffset, selection.anchorOffset);

        } else {
            const position = selection.anchorNode.compareDocumentPosition(selection.focusNode);
            if (position & Node.DOCUMENT_POSITION_PRECEDING) {
                offset = selection.anchorOffset;
                node = selection.anchorNode;
            }
        }

        selection.collapse(node, offset);
        return true;
    }

    let item = selection.focusNode;
    let offset = selection.focusOffset;

    while (item) {
        if (item.nodeType !== Node.TEXT_NODE) {
            return false;
        }

        const len = item.nodeValue.length;

        if (offset + 1 > len) {
            item = item.nextSibling;
            offset = 0;
            continue;
        }

        const text = item.nodeValue.substring(offset, offset + 1);

        if (zws.check(text)) {
            offset = offset + 1;
            continue;
        }

        break;
    }

    if (!item) {
        return false;
    }

    if (append) {
        selection.extend(item, offset + 1);

    } else {
        selection.collapse(item, offset + 1);
    }

    return true;
}
