const bubble = require('./bubble');

const slice = Array.prototype.slice;
const CLASS_SELECT = 'is-select';
const CLASS_BUBBLE = 'bubble';

exports.all = all;
exports.add = add;
exports.clear = clear;
exports.get = get;
exports.uniq = uniq;
exports.head = head;
exports.last = last;
exports.has = has;
exports.range = range;
exports.fullLast = fullLast;
exports.fullHead = fullHead;

function fullLast(set) {
    return set.querySelector(`.${CLASS_BUBBLE}:last-child`);
}

function fullHead(set) {
    return set.querySelector(`.${CLASS_BUBBLE}:first-child`);
}

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
    }
}

function all(set) {
    slice.call(set.querySelectorAll(`.${CLASS_BUBBLE}:not(.${CLASS_SELECT})`)).forEach(item => _add(item));
    set.startRangeSelect = set.querySelector(`.${CLASS_BUBBLE}.${CLASS_SELECT}`);
    const sel = window.getSelection();
    sel && sel.removeAllRanges();
}

function has(set) {
    return Boolean(set.querySelector(`.${CLASS_BUBBLE}.${CLASS_SELECT}`));
}

function head(set) {
    return get(set)[0];
}

function last(set) {
    const list = get(set);
    return list[ list.length - 1 ];
}

function get(set) {
    return slice.call(set.querySelectorAll(`.${CLASS_BUBBLE}.${CLASS_SELECT}`));
}

function clear(set) {
    get(set).forEach(node => node.classList.remove(CLASS_SELECT));
}

function add(node) {
    if (_add(node)) {
        node.parentNode.startRangeSelect = node;
        return true;
    }

    return false;
}

function uniq(node) {
    if (bubble.isBubbleNode(node)) {
        const set = node.parentNode;
        const sel = window.getSelection();
        sel && sel.removeAllRanges();

        // delete set.startRangeSelect;
        clear(set);
        return add(node);
    }

    return false;
}

function _add(node) {
    if (bubble.isBubbleNode(node)) {
        node.classList.add(CLASS_SELECT);
        return true;
    }

    return false;
}
