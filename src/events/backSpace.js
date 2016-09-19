const bubble = require('../bubble');
const utils = require('../utils');
const zws = require('../zws');

module.exports = function (event) {
    if (bubble.isBubbleNode(event.target)) {
        var previousBubble = event.target.previousSibling;
        event.target.parentNode.removeChild(event.target);

        if (bubble.isBubbleNode(previousBubble)) {
            previousBubble.focus();

        } else {
            utils.restoreCursor(event.currentTarget);
        }

    } else {
        backSpace(event.currentTarget);
    }
};

function backSpace(node) {
    var sel = window.getSelection();
    if (!sel) {
        return;
    }

    var range;

    if (sel.isCollapsed && sel.rangeCount) {
        range = setStartOffset(sel.getRangeAt(0), node);
        sel.removeAllRanges();
        sel.addRange(range);
    }

    var startRange = sel.rangeCount && sel.getRangeAt(0);
    var startContainer = startRange && startRange.startContainer;
    if (startContainer === node) {
        startContainer = startContainer.childNodes[ startRange.startOffset - 1 ];
    }

    if (sel.isCollapsed) {
        if (bubble.isBubbleNode(startContainer)) {
            startContainer.focus();
        }

    } else {
        var text = sel.toString();
        var hasZeroWidthSpace = zws.check(text);

        if (hasZeroWidthSpace && text.length === 1 && bubble.isBubbleNode(startContainer)) {
            startContainer.focus();

        } else {
            sel.deleteFromDocument();
            if (hasZeroWidthSpace && sel.rangeCount && sel.isCollapsed) {
                var fakeText = zws.createElement();
                range = sel.getRangeAt(0);

                range.deleteContents();
                range.insertNode(fakeText);
                sel.removeAllRanges();
                sel.collapse(fakeText, 1);
            }
        }
    }
}

function setStartOffset(range, node) {
    var startContainer = range.startContainer;
    var startOffset = range.startOffset - 1;
    var setAfter = false;
    var setBefore = false;

    if (node === startContainer) {
        startContainer = startContainer.childNodes[ startOffset - 1 ];
    }

    if (bubble.isBubbleNode(startContainer)) {
        range.setStartAfter(startContainer);
        range.setEndAfter(startContainer);
        range.collapse(true);
        return range;
    }

    if (startOffset >= 0 &&
        startContainer.nodeType === Node.TEXT_NODE &&
        zws.check(startContainer.nodeValue[ startOffset ])) {

        startOffset--;
    }

    while (startOffset < 0) {
        var previousContainer = startContainer.previousSibling;
        if (!previousContainer) {
            setBefore = true;
            break;
        }

        startContainer = previousContainer;

        if (bubble.isBubbleNode(startContainer)) {
            setAfter = true;
            break;

        } else if (startContainer.nodeType === Node.TEXT_NODE) {
            startOffset = startContainer.nodeValue.length - 1;
        }
    }

    if (setAfter) {
        range.setStartAfter(startContainer);

    } else if (setBefore) {
        range.setStartBefore(startContainer);

    } else {
        range.setStart(startContainer, startOffset);
    }

    return range;
}
