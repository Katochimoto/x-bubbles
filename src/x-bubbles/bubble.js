const zws = require('./zws');

exports.isBubbleNode = isBubbleNode;
exports.bubbling = bubbling;
exports.create = create;

function isBubbleNode(node) {
    if (!node || node.nodeType !== Node.ELEMENT_NODE) {
        return false;
    }

    return node.hasAttribute('bubble');
}

function create(nodeSet, text, data = {}) {
    text = zws.textClean(text);

    if (!text) {
        return;
    }

    const bubbleFormation = nodeSet.options('bubbleFormation');
    const classBubble = nodeSet.options('classBubble');
    const draggable = nodeSet.options('draggable');
    const wrap = document.createElement('span');

    wrap.innerText = text;

    if (draggable) {
        wrap.setAttribute('draggable', 'true');
    }

    for (let key in data) {
        wrap.setAttribute(`data-${key}`, String(data[ key ]));
    }

    bubbleFormation(wrap);

    wrap.classList.add(classBubble);
    wrap.setAttribute('bubble', '');
    wrap.setAttribute('contenteditable', 'false');

    return wrap;
}

function bubbling(nodeSet) {
    const separator = nodeSet.options('separator');
    const ending = nodeSet.options('ending');
    const begining = nodeSet.options('begining');
    const ranges = getBubbleRanges(nodeSet);
    const nodes = [];

    ranges.forEach(function (range) {
        const text = zws.textClean(range.toString());

        if (!text) {
            range.deleteContents();
            return;
        }

        let textParts = [ text ];

        if (separator) {
            textParts = text
                .split(separator)
                .map(trimIterator)
                .filter(nonEmptyIterator);
        }

        if (ending) {
            textParts = textParts
                .reduce((parts, str) => parts.concat(parseFragmentByEnding(str, ending)), [])
                .map(trimIterator)
                .filter(nonEmptyIterator);

        } else if (begining) {
            textParts = textParts
                .reduce((parts, str) => parts.concat(parseFragmentByBeginning(str, begining)), [])
                .map(trimIterator)
                .filter(nonEmptyIterator);
        }

        if (!textParts.length) {
            range.deleteContents();
        }

        const fragment = document.createDocumentFragment();

        textParts.forEach(function (textPart) {
            const nodeBubble = create(nodeSet, textPart);
            if (nodeBubble) {
                fragment.appendChild(nodeBubble);
                nodes.push(nodeBubble);
            }
        });

        range.deleteContents();
        range.insertNode(fragment);
    });

    nodeSet.fireChange();
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
