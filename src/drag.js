const select = require('./select');
const bubble = require('./bubble');
const set = require('./set');

const CLASS_DRAGSTART = 'drag';
const CLASS_DROPZONE = 'dropzone';

let currentDragSet = null;

exports.onDragstart = function (event) {
    event.stopPropagation();

    const nodeBubble = event.target;
    const nodeSet = set.getBubbleSet(nodeBubble);

    if (!nodeSet || !bubble.isBubbleNode(nodeBubble)) {
        event.preventDefault();
        return;
    }

    currentDragSet = nodeSet;
    nodeSet.classList.add(CLASS_DRAGSTART);
    select.add(nodeBubble);

    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', '');
};

exports.onDrop = function (event) {
    event.stopPropagation();
    event.preventDefault();

    if (!currentDragSet) {
        return;
    }

    const nodeSet = set.getBubbleSet(event.target);

    if (!nodeSet || nodeSet === currentDragSet) {
        return;
    }

    const list = select.get(currentDragSet);

    if (!list.length) {
        return;
    }

    list.forEach(item => nodeSet.appendChild(item));
    nodeSet.focus();
};

exports.onDragover = function (event) {
    event.stopPropagation();
    event.preventDefault();

    if (!currentDragSet) {
        return;
    }

    event.dataTransfer.dropEffect = 'move';
};

exports.onDragenter = function (event) {
    event.stopPropagation();
    event.preventDefault();

    if (!currentDragSet) {
        return;
    }

    const nodeSet = set.getBubbleSet(event.target);

    if (!nodeSet || nodeSet === currentDragSet) {
        return;
    }

    nodeSet.classList.add(CLASS_DROPZONE);
};

exports.onDragleave = function (event) {
    event.stopPropagation();
    event.preventDefault();

    if (!currentDragSet) {
        return;
    }

    const nodeSet = set.getBubbleSet(event.target);

    if (!nodeSet || nodeSet === currentDragSet) {
        return;
    }

    nodeSet.classList.remove(CLASS_DROPZONE);
};

exports.onDragend = function (event) {
    event.stopPropagation();
    event.preventDefault();

    if (!currentDragSet) {
        return;
    }

    currentDragSet.classList.remove(CLASS_DRAGSTART);

    const nodeSet = set.getBubbleSet(event.target);

    if (nodeSet && nodeSet !== currentDragSet) {
        nodeSet.classList.remove(CLASS_DROPZONE);
    }

    currentDragSet = null;
};
