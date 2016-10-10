const bubble = require('../bubble');
const cursor = require('../cursor');
const select = require('../select');
const zws = require('../zws');

module.exports = function (event) {
    event.preventDefault();

    const set = event.currentTarget;
    const selectList = select.get(set);

    if (selectList.length) {
        const prevBubble = selectList[0].previousSibling;
        const nextBubble = selectList[ selectList.length - 1 ].nextSibling;
        selectList.forEach(node => node.parentNode.removeChild(node));

        if (bubble.isBubbleNode(prevBubble)) {
            select.uniq(prevBubble);

        } else if (bubble.isBubbleNode(nextBubble)) {
            select.uniq(nextBubble);

        } else {
            set.focus();
            cursor.restore(set);
        }

    } else {
        backSpace(set);
    }
};

function backSpace(set) {
    set.normalize();
    const sel = window.getSelection();
    if (!sel) {
        return;
    }

    let range;

    if (sel.isCollapsed && sel.rangeCount) {
        range = setStartOffset(sel.getRangeAt(0), set);
        sel.removeAllRanges();
        sel.addRange(range);
    }

    const startRange = sel.rangeCount && sel.getRangeAt(0);
    let startContainer = startRange && startRange.startContainer;
    if (startContainer === set) {
        startContainer = startContainer.childNodes[ startRange.startOffset - 1 ];
    }

    if (sel.isCollapsed) {
        if (bubble.isBubbleNode(startContainer)) {
            select.uniq(startContainer);
        }

    } else {
        const text = sel.toString();
        const hasZeroWidthSpace = zws.check(text);

        if ((!text || (hasZeroWidthSpace && text.length === 1)) && bubble.isBubbleNode(startContainer)) {
            select.uniq(startContainer);

        } else {
            const len = sel.rangeCount;
            for (let i = 0; i < len; i++) {
                const rng = sel.getRangeAt(i);
                rng.deleteContents();
            }

            // if (hasZeroWidthSpace) {
            // FIXME не хорошо добавлять пустой узел при каждом удалении....
            const fakeText = zws.createElement();
            range = sel.getRangeAt(0);
            range.insertNode(fakeText);
            range.collapse();

            sel.removeAllRanges();
            sel.addRange(range);
            // }
        }
    }
}

function setStartOffset(range, set) {
    let startContainer = range.startContainer;
    let startOffset = range.startOffset - 1;
    let setAfter = false;
    let setBefore = false;

    if (set === startContainer) {
        startContainer = startContainer.childNodes[ startOffset - 1 ];
    }

    if (!startContainer) {
        return range;
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
        const previousContainer = startContainer.previousSibling;
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
