const zws = require('../zws');

const CLASS_BUBBLE = 'bubble';

module.exports = function (event) {
    event.preventDefault();
    const set = event.currentTarget;
    const sel = window.getSelection();
    const node = sel && sel.anchorNode;
    const hasBubble = Boolean(set.querySelector(`.${CLASS_BUBBLE}`));

    if (node && node.nodeType === Node.TEXT_NODE) {
        let fromNode;
        let toNode;
        let item = node;

        while (item && item.nodeType === Node.TEXT_NODE) {
            fromNode = item;
            item = item.previousSibling;
        }

        item = node;

        while (item && item.nodeType === Node.TEXT_NODE) {
            toNode = item;
            item = item.nextSibling;
        }

        const rng = document.createRange();
        rng.setStartBefore(fromNode);
        rng.setEndAfter(toNode);

        const text = zws.textClean(rng.toString());

        if (text || (!text && !hasBubble)) {
            if (!text) {
                rng.collapse();
            }

            sel.removeAllRanges();
            sel.addRange(rng);
            return true;
        }
    }

    return false;
};
