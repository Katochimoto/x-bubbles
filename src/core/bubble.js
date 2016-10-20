const context = require('../context');
const text = require('./text');
const { escape } = require('./utils');

exports.isBubbleNode = isBubbleNode;
exports.bubbling = bubbling;
exports.create = create;
exports.edit = edit;

function isBubbleNode(node) {
    if (!node || node.nodeType !== Node.ELEMENT_NODE) {
        return false;
    }

    return node.hasAttribute('bubble');
}

function edit(nodeSet, nodeBubble) {
    if (nodeBubble.hasAttribute('readonly')) {
        return false;
    }

    const selection = context.getSelection();

    if (!selection) {
        return false;
    }

    const bubbleDeformation = nodeSet.options('bubbleDeformation');
    let rangeParams = bubbleDeformation(nodeBubble);

    if (!rangeParams) {
        const dataText = text.textClean(nodeBubble.innerText);

        rangeParams = {
            text: dataText,
            startOffset: 0,
            endOffset: dataText.length
        };
    }

    const textFake = text.createZws();
    const textNode = context.document.createTextNode(rangeParams.text);

    nodeSet.fireEdit(nodeBubble);
    nodeSet.replaceChild(textNode, nodeBubble);
    nodeSet.insertBefore(textFake, textNode);

    const range = context.document.createRange();
    range.setStart(textNode, rangeParams.startOffset);
    range.setEnd(textNode, rangeParams.endOffset);

    selection.removeAllRanges();
    selection.addRange(range);
    return true;
}

function create(nodeSet, dataText, data = {}) {
    dataText = text.textClean(dataText);

    if (!dataText) {
        return;
    }

    const bubbleFormation = nodeSet.options('bubbleFormation');
    const classBubble = nodeSet.options('classBubble');
    const draggable = nodeSet.options('draggable');
    const wrap = context.document.createElement('span');

    wrap.innerText = dataText;

    if (draggable) {
        wrap.setAttribute('draggable', 'true');
    }

    for (let key in data) {
        if (data[ key ]) {
            wrap.setAttribute(`data-${key}`, escape(data[ key ]));
        }
    }

    bubbleFormation(wrap);

    if (classBubble) {
        const classes = String(classBubble).trim().split(/\s+/);
        let len = classes.length;

        while (len--) {
            wrap.classList.add(classes[ len ]);
        }
    }

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
        const dataText = text.textClean(range.toString());

        if (!dataText) {
            range.deleteContents();
            return;
        }

        let textParts = [ dataText ];

        if (separator) {
            textParts = dataText
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

        const fragment = context.document.createDocumentFragment();

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

    nodeSet.fireInput();

    if (nodes.length) {
        nodeSet.fireChange();
    }

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
                rng = context.document.createRange();
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
