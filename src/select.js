const bubble = require('./bubble');

const slice = Array.prototype.slice;
const CLASS_SELECT = 'is-select';

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

    if (headList === lastList) {
        set.startRangeSelect = headList;
    }

    const headPosition = node.compareDocumentPosition(headList);
    const lastPosition = node.compareDocumentPosition(lastList);
    let fromNode;
    let toNode;

    // -->---<---+--
    if (headPosition & Node.DOCUMENT_POSITION_PRECEDING && lastPosition & Node.DOCUMENT_POSITION_PRECEDING) {
        fromNode = set.startRangeSelect === headList ? headList : lastList;
        toNode = node;

    // -->---+---<--
    } else if (headPosition & Node.DOCUMENT_POSITION_PRECEDING && lastPosition & Node.DOCUMENT_POSITION_FOLLOWING) {
        fromNode = set.startRangeSelect === headList ? headList : lastList;
        toNode = node;

    // --+--->---<--
    } else if (headPosition & Node.DOCUMENT_POSITION_FOLLOWING && lastPosition & Node.DOCUMENT_POSITION_FOLLOWING) {
        fromNode = node;
        toNode = set.startRangeSelect === headList ? headList : lastList;
    }

    if (fromNode && toNode) {
        let item = fromNode;

        while (item) {
            if (!add(item)) {
                break;
            }

            if (item === toNode) {
                break;
            }

            item = item.nextSibling;
        }
    }
}

function has(set) {
    return Boolean(set.querySelector(`.bubble.${CLASS_SELECT}`));
}

function head(set) {
    return get(set)[0];
}

function last(set) {
    const list = get(set);
    return list[ list.length - 1 ];
}

function get(set) {
    return slice.call(set.querySelectorAll(`.bubble.${CLASS_SELECT}`));
}

function clear(set) {
    get(set).forEach(node => node.classList.remove(CLASS_SELECT));
}

function add(node) {
    if (bubble.isBubbleNode(node)) {
        node.classList.add(CLASS_SELECT);
        return true;
    }

    return false;
}

function uniq(node) {
    if (bubble.isBubbleNode(node)) {
        const set = node.parentNode;
        const sel = window.getSelection();
        sel && sel.removeAllRanges();

        delete set.startRangeSelect;
        clear(set);
        return add(node);
    }

    return false;
}
