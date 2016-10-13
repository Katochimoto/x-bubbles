const context = require('../context');
const zws = require('./zws');

exports.arrowRight = arrowRight;
exports.arrowLeft = arrowLeft;
exports.remove = remove;
exports.html2text = html2text;
exports.currentTextRange = currentTextRange;

function currentTextRange(selection) {
    selection = selection || context.getSelection();

    if (!selection) {
        return;
    }

    const pointNode = do {
        if (selection.focusNode && selection.focusNode.nodeType === Node.TEXT_NODE) {
            selection.focusNode;

        } else if (selection.anchorNode && selection.anchorNode.nodeType === Node.TEXT_NODE) {
            selection.anchorNode;

        } else {
            undefined;
        }
    };

    if (!pointNode) {
        return;
    }

    const range = context.document.createRange();
    let startNode = pointNode;
    let endNode = pointNode;
    let item = pointNode;

    while (item && item.nodeType === Node.TEXT_NODE) {
        startNode = item;
        item = item.previousSibling;
    }

    item = pointNode;

    while (item && item.nodeType === Node.TEXT_NODE) {
        endNode = item;
        item = item.nextSibling;
    }

    range.setStartBefore(startNode);
    range.setEndAfter(endNode);

    return range;
}

function remove(selection) {
    selection = selection || context.getSelection();

    if (!selection || selection.isCollapsed) {
        return false;
    }

    const len = selection.rangeCount;

    for (let i = 0; i < len; i++) {
        selection.getRangeAt(i).deleteContents();
    }

    const fakeText = zws.createElement();
    const range = selection.getRangeAt(0);
    range.insertNode(fakeText);
    // FIXME хорошо бы false, тогда zws в конце удаляется, но в ФФ при этом слетает выделение
    range.collapse(true);

    selection.removeAllRanges();
    selection.addRange(range);

    return true;
}

function arrowLeft(selection, extend) {
    selection = selection || context.getSelection();

    if (!selection) {
        return false;
    }

    if (!selection.anchorNode || selection.anchorNode.nodeType !== Node.TEXT_NODE) {
        return false;
    }

    if (!selection.isCollapsed && !extend) {
        let node = selection.anchorNode;
        let offset = selection.anchorOffset;

        if (selection.anchorNode === selection.focusNode) {
            offset = Math.min(selection.anchorOffset, selection.focusOffset);

        } else {
            const position = selection.anchorNode.compareDocumentPosition(selection.focusNode);
            if (position & Node.DOCUMENT_POSITION_FOLLOWING) {
                offset = selection.focusOffset;
                node = selection.focusNode;
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

        if (offset === null) {
            offset = item.nodeValue.length;
        }

        if (offset - 1 < 0) {
            item = item.previousSibling;
            offset = null;
            continue;
        }

        const text = item.nodeValue.substring(offset - 1, offset);

        if (zws.check(text)) {
            offset = offset - 1;
            continue;
        }

        break;
    }

    if (!item || offset === null) {
        return false;
    }

    if (extend) {
        selection.extend(item, offset - 1);

    } else {
        selection.collapse(item, offset - 1);
    }

    return true;
}

function arrowRight(selection, extend) {
    selection = selection || context.getSelection();

    if (!selection) {
        return false;
    }

    if (!selection.focusNode || selection.focusNode.nodeType !== Node.TEXT_NODE) {
        return false;
    }

    if (!selection.isCollapsed && !extend) {
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

    if (extend) {
        selection.extend(item, offset + 1);

    } else {
        selection.collapse(item, offset + 1);
    }

    return true;
}

function html2text(value) {
    if (!value) {
        return '';
    }

    var DOMContainer = document.implementation.createHTMLDocument('').body;
    DOMContainer.innerText = value;

    return DOMContainer.innerText
        .replace(/^[\u0020\u00a0]+$/gm, '')
        .replace(/\n/gm, ' ')
        .trim();
}
