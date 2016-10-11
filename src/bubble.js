const zws = require('./zws');

const REG_SEPARATOR = /[,]/;
const REG_ENDING = null; // /\@ya\.ru/g;
const REG_BEGINING = null;
const NOOP = function () {};

exports.isBubbleNode = isBubbleNode;
exports.bubbling = bubbling;

function isBubbleNode(node) {
    return node && node.nodeType === Node.ELEMENT_NODE && node.classList.contains('bubble');
}

function bubbling(set, options) {
    options = {
        begining: REG_BEGINING,
        ending: REG_ENDING,
        separator: REG_SEPARATOR,
        draggable: true,
        onBubble: NOOP,
        ...options
    };

    const ranges = getBubbleRanges(set);
    const nodes = [];

    ranges.forEach(function (range) {
        const text = zws.textClean(range.toString());

        if (!text) {
            range.deleteContents();
            return;
        }

        let textParts = [ text ];

        if (options.separator) {
            textParts = text
                .split(options.separator)
                .map(trimIterator)
                .filter(nonEmptyIterator);
        }

        if (options.ending) {
            textParts = textParts
                .reduce((parts, str) => parts.concat(parseFragmentByEnding(str, options.ending)), [])
                .map(trimIterator)
                .filter(nonEmptyIterator);

        } else if (options.begining) {
            textParts = textParts
                .reduce((parts, str) => parts.concat(parseFragmentByBeginning(str, options.begining)), [])
                .map(trimIterator)
                .filter(nonEmptyIterator);
        }

        if (!textParts.length) {
            range.deleteContents();
        }

        const fragment = document.createDocumentFragment();

        textParts.forEach(function (textPart) {
            const wrap = document.createElement('span');
            wrap.innerText = textPart;
            options.onBubble(wrap);

            wrap.classList.add('bubble');
            wrap.setAttribute('contenteditable', 'false');

            if (options.draggable) {
                wrap.setAttribute('draggable', 'true');
            }

            fragment.appendChild(wrap);
            nodes.push(wrap);
        });

        range.deleteContents();
        range.insertNode(fragment);
    });

    return nodes;
}

function getBubbleRanges(set) {
    let i;
    let rng;
    let node;
    const ranges = [];
    const children = set.childNodes;

    for (i = 0; i < children.length; i++) {
        node = children[ i ];

        if (isBubbleNode(node)) {
            if (rng) {
                rng.setEndBefore(node);
                ranges.push(rng);
                rng = undefined;
            }

        } else {
            if (!rng) {
                rng = document.createRange();
                rng.setStartBefore(node);
            }
        }
    }

    if (rng) {
        rng.setEndAfter(node);
        ranges.push(rng);
    }

    return ranges;
}

function trimIterator(str) {
    return str.trim();
}

function nonEmptyIterator(str) {
    return Boolean(str);
}

function parseFragmentByEnding(str, reg) {
    const parts = [];
    let lastIndex = 0;
    let loop = 999;

    reg.lastIndex = 0;
    while (reg.exec(str) !== null && loop) {
        loop--;
        parts.push(str.substring(lastIndex, reg.lastIndex));
        lastIndex = reg.lastIndex;
    }

    return parts;
}

function parseFragmentByBeginning(str, reg) {
    const parts = [];
    let res;
    let index = 0;
    let loop = 999;

    reg.lastIndex = 0;
    while ((res = reg.exec(str)) !== null && loop) {
        loop--;
        if (index !== res.index) {
            parts.push(str.substring(index, res.index));
            index = res.index;
        }
    }

    parts.push(str.substring(index, str.length));
    return parts;
}
