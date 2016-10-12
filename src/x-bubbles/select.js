const bubble = require('./bubble');
const bubbleset = require('./bubbleset');

const slice = Array.prototype.slice;

exports.all = all;
exports.add = add;
exports.clear = clear;
exports.get = get;
exports.uniq = uniq;
exports.head = head;
exports.last = last;
exports.has = has;
exports.range = range;

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
            if (!_add(item)) {
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
    const classBubble = nodeSet.options('classBubble');
    const classBubbleSelect = nodeSet.options('classBubbleSelect');

    slice.call(nodeSet.querySelectorAll(`.${classBubble}:not(.${classBubbleSelect})`)).forEach(item => _add(item));
    nodeSet.startRangeSelect = nodeSet.querySelector(`.${classBubble}.${classBubbleSelect}`);

    bubble.bubbling(nodeSet);

    const selection = window.getSelection();
    selection && selection.removeAllRanges();
}

function has(nodeSet) {
    const classBubble = nodeSet.options('classBubble');
    const classBubbleSelect = nodeSet.options('classBubbleSelect');
    return Boolean(nodeSet.querySelector(`.${classBubble}.${classBubbleSelect}`));
}

function head(set) {
    return get(set)[0];
}

function last(set) {
    const list = get(set);
    return list[ list.length - 1 ];
}

function get(nodeSet) {
    const classBubble = nodeSet.options('classBubble');
    const classBubbleSelect = nodeSet.options('classBubbleSelect');
    return slice.call(nodeSet.querySelectorAll(`.${classBubble}.${classBubbleSelect}`));
}

function clear(nodeSet) {
    const classBubbleSelect = nodeSet.options('classBubbleSelect');
    get(nodeSet).forEach(item => item.classList.remove(classBubbleSelect));
}

function add(node) {
    if (_add(node)) {
        node.parentNode.startRangeSelect = node;
        bubble.bubbling(node.parentNode);
        return true;
    }

    return false;
}

function uniq(node) {
    if (bubble.isBubbleNode(node)) {
        const set = node.parentNode;
        const sel = window.getSelection();
        sel && sel.removeAllRanges();
        clear(set);
        return add(node);
    }

    return false;
}

function _add(node) {
    if (bubble.isBubbleNode(node)) {
        const nodeSet = bubbleset.closestNodeSet(node);
        const classBubbleSelect = nodeSet.options('classBubbleSelect');

        node.classList.add(classBubbleSelect);
        return true;
    }

    return false;
}
