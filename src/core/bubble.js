const context = require('../context');
const text = require('./text');
const bubbleset = require('./bubbleset');
const { escape, canUseDrag } = require('./utils');

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

/**
 * У обертки нельзя делать tabindex=-1, иначе будет слетать фокус с поля ввода.
 * @param {HTMLElement} nodeEditor
 * @param {string} dataText
 * @param {Object} [dataAttributes={}]
 * @returns {?HTMLElement}
 */
function create(nodeEditor, dataText, dataAttributes = {}) {
    dataText = text.textClean(dataText);

    if (!dataText) {
        return;
    }

    const bubbleFormation = nodeEditor.options('bubbleFormation');
    const classBubble = nodeEditor.options('classBubble');
    const draggable = canUseDrag && nodeEditor.options('draggable') && nodeEditor.options('selection');
    const wrap = nodeEditor.ownerDocument.createElement('span');

    wrap.innerText = dataText;

    for (let key in dataAttributes) {
        if (dataAttributes[ key ]) {
            wrap.setAttribute(`data-${key}`, escape(dataAttributes[ key ]));
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
    draggable && wrap.setAttribute('draggable', 'true');

    return wrap;
}

function bubbling(nodeSet) {
    const begining = nodeSet.options('begining');
    const ending = nodeSet.options('ending');
    const separator = nodeSet.options('separator');
    const tokenizer = nodeSet.options('tokenizer');
    const ranges = getBubbleRanges(nodeSet);
    const nodes = [];

    const remainingCapacity = bubbleset.getRemainingCapacity(nodeSet);

    ranges.forEach(function (range) {
        const dataText = text.textClean(range.toString());

        if (!dataText) {
            range.deleteContents();
            return;
        }

        let textParts = [ dataText ];

        if (tokenizer) {
            textParts = tokenizer(dataText);

        } else {
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
        }

        if (!Array.isArray(textParts) || !textParts.length) {
            range.deleteContents();
            return;
        }

        const fragment = context.document.createDocumentFragment();

        textParts.forEach(function (textPart) {
            if (nodes.length >= remainingCapacity) {
                return;
            }

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

function getBubbleRanges(nodeSet) {
    const ranges = [];
    const children = nodeSet.childNodes;
    let range;
    let node;

    for (let i = 0; i < children.length; i++) {
        node = children[ i ];

        if (isBubbleNode(node)) {
            if (range) {
                range.setEndBefore(node);
                ranges.push(range);
                range = undefined;
            }

        } else {
            if (!range) {
                range = context.document.createRange();
                range.setStartBefore(node);
            }
        }
    }

    if (range) {
        range.setEndAfter(node);
        ranges.push(range);
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
