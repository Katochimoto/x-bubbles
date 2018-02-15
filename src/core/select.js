const context = require('../context');
const bubble = require('./bubble');
const bubbleset = require('./bubbleset');

const slice = Array.prototype.slice;
const PATH_SELECTED = '[bubble][selected]';
const PATH_NOT_SELECTED = '[bubble]:not([selected])';

exports.all = all;
exports.add = add;
exports.clear = clear;
exports.get = get;
exports.uniq = uniq;
exports.head = head;
exports.last = last;
exports.has = has;
exports.range = range;
exports.toggleUniq = toggleUniq;
exports.setLast = setLast;

function range(node) {
    if (!bubble.isBubbleNode(node)) {
        return;
    }

    const set = node.parentNode;
    const list = get(set);

    if (!list.length) {
        uniq(node);
        return;
    }

    clear(set);

    const headList = list[0];
    const lastList = list[ list.length - 1 ];

    if (headList === lastList || !set.startRangeSelect) {
        set.startRangeSelect = headList;
    }

    let fromNode;
    let toNode;
    const position = node.compareDocumentPosition(set.startRangeSelect);

    if (position & Node.DOCUMENT_POSITION_PRECEDING) {
        fromNode = set.startRangeSelect;
        toNode = node;

    } else {
        fromNode = node;
        toNode = set.startRangeSelect;
    }

    if (fromNode && toNode) {
        let item = fromNode;

        while (item) {
            if (!setSelected(item)) {
                break;
            }

            if (item === toNode) {
                break;
            }

            item = item.nextSibling;
        }

        bubble.bubbling(set);
    }
}

function all(nodeSet) {
    slice.call(nodeSet.querySelectorAll(PATH_NOT_SELECTED)).forEach(item => setSelected(item));
    nodeSet.startRangeSelect = nodeSet.querySelector(PATH_SELECTED);

    bubble.bubbling(nodeSet);

    const selection = context.getSelection();
    selection && selection.removeAllRanges();
}

function has(nodeSet) {
    return Boolean(nodeSet.querySelector(PATH_SELECTED));
}

function head(set) {
    return get(set)[0];
}

function last(set) {
    const list = get(set);
    return list[ list.length - 1 ];
}

function get(nodeSet) {
    return slice.call(nodeSet.querySelectorAll(PATH_SELECTED));
}

function clear(nodeSet) {
    get(nodeSet).forEach(item => item.removeAttribute('selected'));
}

function add(node) {
    if (setSelected(node)) {
        const nodeSet = bubbleset.closestNodeSet(node);

        nodeSet.startRangeSelect = node;
        // ???
        bubble.bubbling(nodeSet);

        return true;
    }

    return false;
}

function uniq(node) {
    if (!bubble.isBubbleNode(node)) {
        return false;
    }

    const nodeSet = bubbleset.closestNodeSet(node);
    const selection = context.getSelection();

    selection && selection.removeAllRanges();
    clear(nodeSet);

    return add(node);
}

function setLast(nodeEditor) {
    return uniq(bubbleset.lastBubble(nodeEditor));
}

function toggleUniq(node) {
    if (isSelected(node)) {
        const nodeSet = bubbleset.closestNodeSet(node);

        if (get(nodeSet).length === 1) {
            return removeSelected(node);
        }
    }

    return uniq(node);
}

function isSelected(node) {
    return bubble.isBubbleNode(node) && node.hasAttribute('selected') || false;
}

function setSelected(node) {
    if (bubble.isBubbleNode(node)) {
        node.setAttribute('selected', '');
        return true;
    }

    return false;
}

function removeSelected(node) {
    if (bubble.isBubbleNode(node)) {
        node.removeAttribute('selected');
        return true;
    }

    return false;
}
